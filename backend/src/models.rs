use serde::{Deserialize, Serialize};

use crate::schema::posts;

#[derive(Queryable, Debug, Serialize, Deserialize, Insertable, Clone)]
pub struct Post {
    pub id: String,
    pub school_id: String,
    pub subject_name: String,
    pub title: String,
    pub body: String,
    /// UNIX timestamp (UTC timezone)
    pub timestamp: i32,
}

#[derive(Insertable, Deserialize, Debug)]
#[table_name = "posts"]
pub struct NewPost {
    pub school_id: String,
    pub subject_name: String,
    pub title: String,
    pub body: String,
}
