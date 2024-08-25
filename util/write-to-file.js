const fs = require("fs");
const path = require("path");

module.exports = (data) => {
  try {
    fs.writeFileSync(
      path.join(__dirname, "..", "data", "db.json"),
      JSON.stringify(data),
      "UTF-8"
    );
  } catch (err) {
    console.error(err);
  }
};
