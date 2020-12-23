// const mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "forest",
  password: "",
  database: "db_name"
});

con.connect(err => {
  if (err) throw err;
  console.log("db is running");
});

module.exports = con;
