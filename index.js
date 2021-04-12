const express = require("express");
const mysql = require("mysql");

// create connection

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test1",
});

//connect

db.connect((error) => {
  if (error) {
    throw error;
  }
  console.log("mysql connected....");
});
const app = express();

app.use(express.json());

//create db
// app.get("/createdb", (req, res) => {
//   let sql = "CREATE DATABASE test1";
//   db.query(sql, (err, result) => {
//     if (err) throw err;
//     console.log(result);
//     res.send("database created...");
//   });
// });

//create table
app.post("/createdata", (req, res) => {
  let keys = [];
  let values = [];
  let escapedsql = [];

  Object.keys(req.body).forEach((obj) => {
    keys.push(obj);
    values.push(req.body[obj]);
    // console.log("obj", obj);
    escapedsql.push("?");
  });

  let postBody =
    "insert into user (" + keys.join() + ") values (" + escapedsql.join() + ")";

  let sql = db.format(postBody, values);

  db.query(sql, (err, result) => {
    console.log(result);
    if (result.affectedRows) {
      res.status(201).json({
        success: true,
        msg: "Record inserted",
        data: req.body,
      });
    }
  });
  //   arr.forEach((ele) => {
  //     leftQuery = ele
  //   })
  //   console.log(req.body);
  //   let sql =
  //     "INSERT INTO `user` (`name`, `email`, `mobile`) VALUES ('Biswajit Pradhan','biswa@gmail.com','9937816787')";
  //   db.query(sql, (err, result) => {
  //     if (err) throw err;
  //     console.log(result);
  //     res.send("inserted");
  //   });
});

app.listen("3000", () => {
  console.log("server start on port 3000");
});
