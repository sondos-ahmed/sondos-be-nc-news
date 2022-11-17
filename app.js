const express = require("express");
const { getAllTopics } = require("./controllers/topics");
const {
  getAllArticles,
  getArticleById,
  getArticleComments,
  postComment,
  patchArticleVotes,
} = require("./controllers/articles");

const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

module.exports = app;
