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
app.get("/create/db", (req, res) => {
  let sql = "CREATE DATABASE test1";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("database created...");
  });
});

// insert data with email validation
app.post("/data/create", (req, res) => {
  let email = req.body.email;
  let qry = `SELECT COUNT(*) As cnt FROM user WHERE email ='${email}'`;

  db.query(qry, (err, result) => {
    if (result[0].cnt > 0) {
      res.status(401).json({
        msg: "Email already registered",
      });
    } else {
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
        "insert into user (" +
        keys.join() +
        ") values (" +
        escapedsql.join() +
        ")";

      let sql = db.format(postBody, values);

      db.query(sql, (err, result) => {
        console.log("insert", result);
        if (result) {
          return res.status(201).json({
            success: true,
            msg: "Record inserted",
            data: req.body,
          });
        }
      });
    }
  });
});
//get all data
app.get("/data/all", (req, res) => {
  let sql = "SELECT * FROM user";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.status(201).json({
      success: true,

      data: result,
    });
  });
});

// get data by id

app.get("/data/:id", (req, res) => {
  let sql = `SELECT * FROM user WHERE id=${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.status(201).json({
      success: true,
      msg: "single data show",
      data: result,
    });
  });
});

// get data by id (post method)
app.post("/data/post/id", (req, res) => {
  let sql = `SELECT * FROM user WHERE id=${req.body.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.status(201).json({
      success: true,
      data: result,
    });
  });
});

// update data
app.post("/data/update", (req, res) => {
  let sql = `UPDATE user SET name='${req.body.name}',mobile='${req.body.mobile}' WHERE id='${req.body.id}'`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.status(201).json({
      success: true,
      massage: "data updated",
    });
  });
});

//delete data (get method)
app.get("/data/delete/:id", (req, res) => {
  let sql = ` DELETE FROM user WHERE id='${req.params.id}'`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.status(201).json({
      success: true,
      massage: "data deleted",
    });
  });
});

// delete data (post method)
app.post("/data/delete", (req, res) => {
  let sql = ` DELETE FROM user WHERE id='${req.body.id}'`;

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.status(201).json({
      success: true,
      massage: "data deleted",
    });
  });
});

app.listen("3000", () => {
  console.log("server start on port 3000");
});
