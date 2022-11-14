const express = require("express");
const { getAllTopics } = require("./controllers/topics");
const { getAllArticles, getArticleById } = require("./controllers/articles");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  res.status(err.status).send({ message: err.message });
});

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

module.exports = app;
