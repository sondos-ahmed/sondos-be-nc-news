const {
  selectAllArticles,
  selectArticleById,
  selectArticleComments,
} = require("../models/articles");

exports.getAllArticles = (req, res, next) => {
  selectAllArticles().then((articles) => {
    res.send({ articles });
  });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticleById(id)
    .then((article) => {
      res.send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const id = req.params.article_id;

  // Used selectArticleById model to check if the article exists.

  selectArticleById(id)
    .then(() => {
      return selectArticleComments(id);
    })
    .then((comments) => {
      res.send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
