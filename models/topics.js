const db = require("../db/connection");

exports.selectAllTopics = () => {
  return db.query("SELECT * FROM topics;").then((data) => {
    return data.rows;
  });
};

exports.selectAllArticles = () => {
  const selectQuery = `
  SELECT articles.author,articles.title,articles.article_id ,articles.topic,articles.created_at,articles.votes, COUNT(articles.article_id) AS comment_count FROM articles JOIN  users ON articles.author=users.username
  LEFT JOIN comments ON articles.article_id=comments.article_id
  GROUP BY comments.article_id, articles.article_id
  ORDER BY articles.created_at DESC
  ;`;
  return db.query(selectQuery).then(({ rows }) => {
    return rows;
  });
};
