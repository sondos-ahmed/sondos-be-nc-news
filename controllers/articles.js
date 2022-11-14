const { selectAllArticles, selectArticleById } = require("../models/articles");

exports.getAllArticles = (req, res, next) => {
  selectAllArticles().then((articles) => {
    res.send({ articles });
  });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticleById(id).then((article) => {
    res.send({ article });
  });
};
