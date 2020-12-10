#[derive(Queryable)]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub body: String,
}

table! {
    posts (id) {
        id -> Text,
        title -> Nullable<Text>,
        body -> Text,
    }
}
