const db = require("../db/connection");

exports.selectAllArticles = (
  topic,
  order = "DESC",
  sorted_by = "created_at"
) => {
  const validColumn = ["title", "topic", "author", "created_at", "votes"];
  const validOrder = ["DESC", "ASC"];
  if (!validColumn.includes(sorted_by)) {
    return Promise.reject({ status: 400, message: "Invalid sort query" });
  }

  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, message: "Invalid order query" });
  }
  const values = [];
  let selectQuery = `
    SELECT articles.author,articles.title,articles.article_id ,articles.topic,articles.created_at,articles.votes, COUNT(comments.article_id) AS comment_count FROM articles JOIN  users ON articles.author=users.username
    LEFT JOIN comments ON articles.article_id=comments.article_id `;

  if (topic) {
    selectQuery += ` WHERE articles.topic=$1`;
    values.push(topic);
  }

  selectQuery += ` 
  GROUP BY comments.article_id, articles.article_id 
  ORDER BY articles.${sorted_by} ${order};`;
  return db.query(selectQuery, values).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 400, message: "Topic doesn't exist" });
    }
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
  SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles 
  LEFT JOIN comments ON articles.article_id=comments.article_id
  WHERE articles.article_id=$1
  GROUP BY comments.article_id, articles.article_id ;`;
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

  if (typeof body !== "string" || body.length <= 1) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }

  if (typeof author !== "string" || author.length <= 1) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }

  return db
    .query(
      "INSERT INTO comments (article_id,author,body) VALUES ($1,$2,$3) RETURNING *;",
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

exports.updateArticleVotes = (article_id, inc_votes) => {
  if (isNaN(inc_votes)) {
    return Promise.reject({ status: 400, message: "Invalid vote type" });
  }

  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }
  return db
    .query(
      "UPDATE articles SET votes=votes+$2 WHERE article_id=$1 RETURNING *;",
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
