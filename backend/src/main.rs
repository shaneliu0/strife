use crate::schema::posts;
use actix_web::{
    dev::HttpResponseBuilder, get, guard, post, web, App, HttpRequest, HttpResponse, HttpServer,
    Responder, Result,
};

#[macro_use]
extern crate diesel;
extern crate dotenv;

use actix_files as fs;
use diesel::sqlite::SqliteConnection;
use std::env;

use diesel::r2d2::{self, ConnectionManager};
use diesel::{prelude::*, sqlite::Sqlite};

use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::posts::dsl::posts as posts_table;

pub mod schema;

type DbPool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

#[derive(Queryable, Debug, Serialize, Deserialize, Insertable, Clone)]
pub struct Post {
    pub id: String,
    pub title: Option<String>,
    pub body: String,
}

#[derive(Insertable, Deserialize, Debug)]
#[table_name = "posts"]
pub struct NewPost {
    title: String,
    body: String,
}

#[derive(Serialize, Deserialize, Clone)]
struct JsonPostResponse {
    posts: Vec<Post>,
}

async fn get_posts() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().json(JsonPostResponse {
        posts: vec![
            Post {
                id: "1".to_string(),
                title: Some("222".to_string()),
                body: "f".to_string(),
            },
            Post {
                id: "2".to_string(),
                title: Some("hey".to_string()),
                body: "bruh".to_string(),
            },
            Post {
                id: "3".to_string(),
                title: Some("epic website".to_string()),
                body: "hi".to_string(),
            },
        ],
    }))
}

pub fn insert_new_post(
    title: &str,
    body: &str,
    conn: &SqliteConnection,
) -> Result<Post, diesel::result::Error> {
    let new_post = Post {
        title: Some(title.to_string()),
        body: body.to_string(),
        id: Uuid::new_v4().to_string(),
    };

    diesel::insert_into(posts_table)
        .values(&new_post)
        .execute(conn)?;
    Ok(new_post)
}

#[post("/api")]
async fn create_post(pool: web::Data<DbPool>, form: web::Json<NewPost>) -> Result<impl Responder> {
    let conn = pool.get().expect("Failed to get db connection from pool.");

    let new_post = web::block(move || insert_new_post(&form.title, &form.body, &conn)).await?;

    Ok(HttpResponse::Ok().json(new_post))
}

pub fn find_post_by_uid(
    uid: Uuid,
    conn: &SqliteConnection,
) -> Result<Option<Post>, diesel::result::Error> {
    use crate::schema::posts::dsl::*;

    let user = posts
        .filter(id.eq(uid.to_string()))
        .first::<Post>(conn)
        .optional()?;

    Ok(user)
}

#[get("/api/{user_id}")]
async fn get_post_by_id(
    pool: web::Data<DbPool>,
    user_uid: web::Path<Uuid>,
) -> Result<HttpResponse, actix_web::Error> {
    let user_uid = user_uid.into_inner();
    let conn = pool.get().unwrap();

    // use web::block to offload blocking Diesel code without blocking server thread
    let post = web::block(move || find_post_by_uid(user_uid, &conn))
        .await
        .map_err(|e| {
            eprintln!("{}", e);
            HttpResponse::InternalServerError().finish()
        })?;

    if let Some(post) = post {
        Ok(HttpResponse::Ok().json(post))
    } else {
        let res = HttpResponse::NotFound().body(format!("No user found with uid: {}", user_uid));
        Ok(res)
    }
}

async fn react_index() -> Result<actix_files::NamedFile> {
    Ok(fs::NamedFile::open("../frontend/build/index.html")?)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let _ = dotenv::dotenv();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let connection = SqliteConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url));

    let manager = ConnectionManager::<SqliteConnection>::new(database_url);

    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to initialize database pool.");

    HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .service(create_post)
            .route("/api", web::get().to(get_posts))
            .service(fs::Files::new("/static", "../frontend/build/static"))
            .default_service(
                web::resource("").route(web::get().to(react_index)).route(
                    web::route()
                        .guard(guard::Not(guard::Get()))
                        .to(|| HttpResponse::MethodNotAllowed()),
                ),
            )
    })
    .bind("localhost:8080")?
    .run()
    .await
}
