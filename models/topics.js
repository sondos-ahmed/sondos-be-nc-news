const db = require("../db/connection");

exports.selectAllTopics = () => {
  console.log("Model");
  return db.query("SELECT * FROM topics;").then((data) => {
    console.log({ topics: data.rows });
    return data.rows;
  });
};
