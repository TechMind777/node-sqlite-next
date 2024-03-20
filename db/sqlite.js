// db.js

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { addUser } = require("../models/users");
// let dbConnection;
// Function to establish SQLite database connection
function connectDatabase() {
  const dbPath = path.resolve(__dirname, "db_sqlite", "database.db");
  global.dbConnection = new sqlite3.Database(dbPath);

  // Create a table (if not exists)
  dbConnection.serialize(() => {
    //users table
    dbConnection.run(
      "CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, name TEXT, email TEXT, phone TEXT, password TEXT, isAdmin INT, create_at TEXT, update_at TEXT, status TEXT, create_by TEXT)",
      (err, result, r) => {
        if (err) {
          console.error("error", err.message);
          return;
        } else {
          console.info("Table users created");
          insertAdminUser();
        }
      }
    );

    //users payments
    dbConnection.run(
      "CREATE TABLE payments (id INTEGER PRIMARY KEY, user_id INT, amount INT, description TEXT, doc TEXT, status TEXT, create_at TEXT, update_at TEXT)",
      (err, result, r) => {
        if (err) {
          console.error("error", err.message);
          return;
        } else {
          console.info("Table payments created");
        }
      }
    );

    //
  });

  return dbConnection;
}

// connectDatabase()
function insertAdminUser() {
  console.log("insertAdminUser");
  return addUser({
    
    username: "admin",
    name: "Administrator",
    email: "address@example.com",
    phone: "995823529",
    password: "pass1234",
    isAdmin:1, 
    create_at: new Date(),
    update_at: new Date(),
    status: "approved",
    create_by: "0"
  });
}
module.exports = { connectDatabase };
