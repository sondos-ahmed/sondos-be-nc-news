const { readJSON } = require("../models/api");

exports.getJSON = (req, res, next) => {
  const file = readJSON();

  res.send({ file });
};
