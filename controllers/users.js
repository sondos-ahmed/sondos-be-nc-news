const { selectAllUsers } = require("../models/users");

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
