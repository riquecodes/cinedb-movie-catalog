const pool = require("../db");
const User = require("../domain/user");

const userModel = {
  async findByUsername(username) {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (rows.length === 0) {
      return null;
    }

    return new User(rows[0]);
  },

  async register({ username, password }) {
    const [result] = await pool.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );
    return new User({
      id: result.insertId,
      username,
      password,
      createdAt: new Date(),
    });
  },
};

module.exports = userModel;