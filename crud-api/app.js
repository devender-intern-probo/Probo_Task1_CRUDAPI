var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// default route
app.get("/", function (req, res) {
  return res.send({ error: true, message: "hello" });
});
// connection configurations
var connectionForMysql = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "node_js_api",
});
// connect to database
connectionForMysql.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
});
// Retrieve all users
app.get("/users", function (req, res) {
  connectionForMysql.query(
    "SELECT * FROM users",
    function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, data: results, message: "users list." });
    }
  );
});
// Add a new user
app.post("/user", function (req, res) {
  let user = req.body;
  console.log(user);
  if (!user) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide user" });
  }
  connectionForMysql.query(
    `INSERT INTO users values("${user.First_Name}","${user.Last_Name}","${user.Email}",${user.Mobile},${user.ID},"${user.Gender}","${user.Image}") `,
    // { user: user },
    function (error, results) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results,
        message: "New user has been created successfully.",
      });
    }
  );
});
//  Update user with id
app.put("/user", function (req, res) {
  try {
    let user = req.body.user;
    let user_id = req.body.user_id;
    console.log(user);
    console.log(user_id);
    if (!user_id || !user) {
      return res
        .status(400)
        .send({ error: user, message: "Please provide user and user_id" });
    }
    connectionForMysql.query(
      "UPDATE users SET ? WHERE id = ?",
      [user, user_id],
      function (error, results) {
        if (error) throw error;
        if(results.affectedRows == 0) 
          return res.send({
            error: true,
            message: "User_ID doesn't exist.",
        });
        return res.send({
          error: false,
          data: results,
          message: "Users Table has been updated successfully.",
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
});
//  Delete user
app.delete("/user", function (req, res) {
  let user_id = req.body.user_id;
  console.log(user_id);
  if (!user_id) {
    return res
      .status(400)
      .send({ error: true, message: "Please provide user_id" });
  }
  connectionForMysql.query(
    "DELETE FROM users WHERE id = ?",
    [user_id],
    function (error, results) {
      if (error) throw error;
      if(results.affectedRows == 0) 
          return res.send({
            error: true,
            message: "User_ID doesn't exist.",
      });
      return res.send({
        error: false,
        data: results,
        message: "Users Table has been updated successfully.",
      });
    }
  );
});
// set port
app.listen(3000, function () {
  console.log("Node app is running on port 3000");
});
module.exports = app;
