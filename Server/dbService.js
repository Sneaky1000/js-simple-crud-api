const mysql = require('mysql');
const dotenv = require('dotenv');
const { response } = require('express');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('db ' + connection.state);
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  getAllData() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM names;";

      connection.query(query, (err, results) => {
        if (err) reject(new Error(err.message));
          resolve(results);
      })
    });
  }

  insertNewName(name) {
    const dateAdded = new Date();
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO names (name, date_added) VALUES (?,?);";

      connection.query(query, [name, dateAdded] ,(err, result) => {
        if (err) reject(new Error(err.message));
          resolve(result.insertId);
      })
    });
  }

  deleteRowById(id) {
    id = parseInt(id, 10);
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM names WHERE id = ?;";

      connection.query(query, [id] ,(err, result) => {
        if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
      })
    });
  }

  updateNameById(id, name) {
    id = parseInt(id, 10);
    return new Promise((resolve, reject) => {
      const query = "UPDATE names SET name = ? WHERE id = ?;";

      connection.query(query, [name, id] ,(err, result) => {
        if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
      })
    });
  }

  searchByName(name) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM names WHERE name = ?;";

      connection.query(query, [name],(err, results) => {
        if (err) reject(new Error(err.message));
          resolve(results);
      })
    });
  }
}

module.exports = DbService;