const userModel = require("../../models/userModel");
const pool = require("../../db");

jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("UserModel", () => {
  it("deve criar um novo usuário", async () => {
    pool.query.mockResolvedValueOnce([{ insertId: 1 }]);
    const user = await userModel.register({
      username: "henrique",
      password: "123456",
    });

    expect(user).toHaveProperty("id", 1);
    expect(user).toHaveProperty("username", "henrique");
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      ["henrique", "123456"]
    );
  });
});