const { readJSON } = require("../models/api");

exports.getJSON = (req, res, next) => {
  const file = readJSON();

  res.send({ file });
};

exports.getHealth = (req, res, next) => {
  res.status(200).send({ message: "server up and running" });
};
