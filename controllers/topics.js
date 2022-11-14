const { selectAllTopics } = require("../models/topics");

exports.getAllTopics = (req, res, next) => {
  console.log("Controller");
  selectAllTopics().then((topics) => {
    res.send({ topics });
  });
};
