const { selectAllTopics, selectAllArticles } = require("../models/topics");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics().then((topics) => {
    res.send({ topics });
  });
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles().then((articles) => {
    res.send({ articles });
  });
};
