const db = require("../db/connection");

exports.selectAllUsers = () => {
  console.log("rows");

  return db.query("SELECT * FROM users;").then(({ rows }) => {
    console.log(rows);
    return rows;
  });
};
