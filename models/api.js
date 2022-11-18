const { readFile } = require("fs/promises");

exports.readJSON = () => {
  return readFile("./endpoints.json", "utf-8").then((file) => {
    return file;
  });
};
