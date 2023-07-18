const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db/db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Conectado a la base de datos SQLite");
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, 
        email TEXT UNIQUE NOT NULL, 
        password TEXT NOT NULL, 
        CONSTRAINT email_unique UNIQUE (email)
      )`,
      (err) => {
        if (err) {
          // La tabla ya existe
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        access_token TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )`,
      (err) => {
        if (err) {
          // La tabla ya existe
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS quizzesTable (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pregunta TEXT NOT NULL,
        opcionA TEXT NOT NULL,
        opcionB TEXT NOT NULL,
        opcionC TEXT NOT NULL,
        opcionD TEXT NOT NULL,
        respuestaCorrecta TEXT NOT NULL,
        explicacion TEXT NOT NULL
      )`,
      (err) => {
        if (err) {
          // La tabla ya existe
        }
      }
    );

    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        const tables = rows.map(row => row.name);
        console.log("Tablas de la base de datos:", tables);
      }
    });
  }
});

module.exports = db;
