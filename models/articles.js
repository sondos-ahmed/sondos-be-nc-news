const { rows } = require("pg/lib/defaults");
const db = require("../db/connection");

exports.selectAllArticles = () => {
  const selectQuery = `
    SELECT articles.author,articles.title,articles.article_id ,articles.topic,articles.created_at,articles.votes, COUNT(comments.article_id) AS comment_count FROM articles JOIN  users ON articles.author=users.username
    LEFT JOIN comments ON articles.article_id=comments.article_id
    GROUP BY comments.article_id, articles.article_id
    ORDER BY articles.created_at DESC
    ;`;
  return db.query(selectQuery).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      message: "Bad request",
    });
  }
  const selectQuery = `
    SELECT * FROM articles WHERE article_id=$1
    ;`;
  return db.query(selectQuery, [article_id]).then(({ rows }) => {
    if (!rows[0]) {
      return Promise.reject();
    }
    return rows[0];
  });
};

exports.selectArticleComments = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at ASC;",
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (article_id, newcomment) => {
  const { author, body } = newcomment;

  const values = [article_id, author, body];
  return db
    .query(
      "INSERT INTO comments (article_id,author,body) VALUES ($1,$2,$3) RETURNING body;",
      values
    )
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      if (err) {
        return Promise.reject({ status: 400, message: "User not found" });
      }
    });
};
