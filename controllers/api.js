const { readJSON } = require("../models/api");

exports.getJSON = (req, res, next) => {
  readJSON()
    .then((file) => {
      res.send({ file });
    })
    .catch((err) => {
      next(err);
    });
};
