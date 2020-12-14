use crate::schema::posts;
use actix_web::{get, post, web, App, HttpRequest, HttpResponse, HttpServer, Responder, Result};

#[macro_use]
extern crate diesel;
extern crate dotenv;

use actix_files as fs;
use diesel::sqlite::SqliteConnection;
use diesel::{prelude::*, sqlite::Sqlite};
use std::env;

use serde::{Deserialize, Serialize};

pub mod schema;

#[derive(Queryable, Debug, Serialize, Deserialize, Clone)]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub body: String,
}

#[derive(Insertable, Deserialize, Debug)]
#[table_name = "posts"]
pub struct NewPost {
    title: String,
    body: String,
}

// pub fn create_post<'a>(conn: &SqliteConnection, title: &'a str, body: &'a str) -> Post {
//     let new_post = NewPost { title, body };
//     diesel::insert_into(posts::table)
//         .values(&new_post)
//         .get_result(conn)
//         .expect("error inserting into database")
// }

pub fn establish_connection() -> SqliteConnection {
    let _ = dotenv::dotenv();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}

// async fn greet(req: HttpRequest) -> impl Responder {
//     let name = req.match_info().get("name").unwrap_or("World");
//     format!("Hello {}!", &name)
// }

#[derive(Serialize, Deserialize, Clone)]
struct JsonPostResponse {
    posts: Vec<Post>,
}

#[get("/allposts")]
async fn db_fetch() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().json(JsonPostResponse {
        posts: vec![
            Post {
                id: 1,
                title: "222".to_string(),
                body: "f".to_string(),
            },
            Post {
                id: 2,
                title: "hey".to_string(),
                body: "bruh".to_string(),
            },
            Post {
                id: 3,
                title: "epic website".to_string(),
                body: "hi".to_string(),
            },
        ],
    }))
}

async fn make_post(post: web::Form<NewPost>) -> Result<impl Responder> {
    Ok(format!("You typed: {:?}", post))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // let connection = establish_connection();

    // let post = create_post(&connection, "this is", "a test");

    HttpServer::new(|| {
        App::new()
            .route("/makepost", web::post().to(make_post))
            .service(db_fetch)
            .service(fs::Files::new("/", "../frontend/build").index_file("index.html"))
    })
    .bind("localhost:8000")?
    .run()
    .await
}
