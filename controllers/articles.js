const {
  selectAllArticles,
  selectArticleById,
  selectArticleComments,
  insertComment,
  updateArticleVotes,
} = require("../models/articles");

exports.getAllArticles = (req, res, next) => {
  const { topic, order, sort_by } = req.query;
  selectAllArticles(topic, order, sort_by)
    .then((articles) => {
      res.send({ articles });
    })
    .catch((err) => {
      next(err);
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

exports.postComment = (req, res, next) => {
  const id = req.params.article_id;
  const newComment = req.body;

  selectArticleById(id)
    .then(() => {
      return insertComment(id, newComment);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

//Task 8: update article votes

exports.patchArticleVotes = (req, res, next) => {
  const id = req.params.article_id;
  const inc_votes = req.body.inc_votes;
  // check if the article exist
  selectArticleById(id)
    .then(() => {
      return updateArticleVotes(id, inc_votes);
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
