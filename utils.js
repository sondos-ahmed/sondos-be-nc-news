const db = require("./db/connection");

exports.checkTopic = (topic) => {
  let found = false;

  return db
    .query("SELECT * FROM topics WHERE slug=$1; ", [topic])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 400, message: "Topic doesn't exist" });
      }
      return rows;
    });
};
