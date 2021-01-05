use crate::schema::posts;
use actix_web::{get, guard, post, web, App, HttpResponse, HttpServer, Responder, Result};

#[macro_use]
extern crate diesel;
extern crate dotenv;

use actix_files as fs;
use std::env;

use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use diesel::sqlite::SqliteConnection;

use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};
use uuid::Uuid;

pub mod models;
pub mod schema;

type DbPool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

#[derive(Serialize, Deserialize, Clone)]
struct JsonPostResponse {
    posts: Vec<models::Post>,
}

#[get("/api/all")]
async fn get_posts(pool: web::Data<DbPool>) -> Result<HttpResponse, actix_web::Error> {
    let conn = pool.get().unwrap();

    let posts = web::block(move || get_all_posts(&conn))
        .await
        .map_err(|e| {
            eprintln!("{}", e);
            HttpResponse::InternalServerError().finish()
        })?;

    Ok(HttpResponse::Ok().json(posts))
}

pub fn get_all_posts(conn: &SqliteConnection) -> Result<Vec<models::Post>, diesel::result::Error> {
    use crate::schema::posts::dsl::*;

    posts.load::<models::Post>(conn)
}

pub fn insert_new_post(
    title: &str,
    body: &str,
    school: &str,
    subject: &str,
    conn: &SqliteConnection,
) -> Result<models::Post, diesel::result::Error> {
    use crate::posts::dsl::posts;

    let new_post = models::Post {
        id: Uuid::new_v4().to_string(),
        title: title.to_string(),
        body: body.to_string(),
        school_id: school.to_string(),
        subject_name: subject.to_string(),
        timestamp: SystemTime::now()
            .duration_since(UNIX_EPOCH)
            // I'm not really sure if this is correct
            .unwrap_or_else(|e| e.duration())
            .as_secs() as i32,
    };

    diesel::insert_into(posts).values(&new_post).execute(conn)?;
    Ok(new_post)
}

#[post("/api")]
async fn create_post(
    pool: web::Data<DbPool>,
    form: web::Json<models::NewPost>,
) -> Result<impl Responder> {
    let conn = pool.get().unwrap();

    let new_post = web::block(move || {
        insert_new_post(
            &form.title,
            &form.body,
            &form.school_id,
            &form.subject_name,
            &conn,
        )
    })
    .await?;

    Ok(HttpResponse::Ok().json(new_post))
}

pub fn find_post_by_uid(
    uid: Uuid,
    conn: &SqliteConnection,
) -> Result<Option<models::Post>, diesel::result::Error> {
    use crate::schema::posts::dsl::*;

    let user = posts
        .filter(id.eq(uid.to_string()))
        .first::<models::Post>(conn)
        .optional()?;

    Ok(user)
}

#[get("/api/{post_id}")]
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
        Ok(HttpResponse::NotFound().body(format!("No user found with uid: {}", user_uid)))
    }
}

async fn react_index() -> Result<actix_files::NamedFile> {
    Ok(fs::NamedFile::open("../frontend/build/index.html")?)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let _ = dotenv::dotenv();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<SqliteConnection>::new(database_url);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to initialize database pool.");

    let port: u32 = match env::var("PORT").map(|s| s.parse::<u32>()) {
        Ok(n) => match n {
            Ok(n) => Some(n),
            Err(e) => {
                println!(
                    "Port number failed to parse ({}), using default value...",
                    e
                );
                None
            }
        },
        Err(_) => {
            println!("Port not specified, using default value...");
            None
        }
    }
    .unwrap_or(8080);

    println!("Starting server on port {}...", port);

    HttpServer::new(move || {
        App::new()
            .data(pool.clone())
            .service(get_posts)
            .service(create_post)
            .service(get_post_by_id)
            .service(fs::Files::new("/static", "../frontend/build/static"))
            .default_service(
                web::resource("").route(web::get().to(react_index)).route(
                    web::route()
                        .guard(guard::Not(guard::Get()))
                        .to(HttpResponse::MethodNotAllowed),
                ),
            )
    })
    .bind(format!("localhost:{}", port))?
    .run()
    .await
}
