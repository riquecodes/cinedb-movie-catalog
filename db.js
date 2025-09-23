const mysql = require("mysql2/promise");
require("dotenv").config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 25402,
};

if (process.env.DB_SSL === "true") {
  config.ssl = {
    rejectUnauthorized: true,
  };
}

const pool = mysql.createPool(config);

module.exports = pool;