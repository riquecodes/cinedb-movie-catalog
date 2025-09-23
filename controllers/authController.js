const userModel = require("../models/userModel");

const authController = {
  async register(req, res) {
    try {
      const { username, password } = req.body;

      const existingUser = await userModel.findByUsername(username);

      if (existingUser) {
        return res.status(400).json({ error: "Username já existe." });
      }

      const newUser = await userModel.register({ username, password });

      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
      });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      res.status(500).json({ error: "Erro ao registrar usuário." });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await userModel.findByUsername(username);

      if (!user || user.password !== password) {
        return res.status(400).json({ error: "Usuário ou senha incorretos." });
      }

      res.json({ id: user.id, username: user.username });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      res.status(500).json({ error: "Erro ao fazer login." });
    }
  },
};

module.exports = authController;