const db = require("../db/connection");

exports.deleteCommentModel = (id) => {
  const comment_id = parseInt(id);

  if (isNaN(comment_id)) {
    return Promise.reject({
      status: 400,
      message: "Bad request",
    });
  }

  return db
    .query("DELETE FROM comments WHERE comment_id=$1 RETURNING *;", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, message: "comment not found" });
      }
    });
};
