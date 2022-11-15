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
    return rows[0];
  });
};
