const express = require("express");
const { getAllTopics, getAllArticles } = require("./controllers/topics");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.use((err, req, res, next) => {
  res.status(err.status).send(err);
});

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Route not found" });
});

module.exports = app;
