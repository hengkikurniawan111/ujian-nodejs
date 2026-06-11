const { Sequelize } = require("sequelize");
const path = require("path");

// Menggunakan SQLite local file agar mudah dijalankan tanpa setup database server (MySQL/PostgreSQL)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../database.sqlite"),
  logging: false, // Set ke console.log jika ingin melihat SQL queries yang dieksekusi
});

module.exports = sequelize;
