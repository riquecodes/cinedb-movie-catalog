class User {
  constructor({ id, username, password, createdAt }) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.createdAt = createdAt;
  }
}

module.exports = User;