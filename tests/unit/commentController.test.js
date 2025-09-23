const commentController = require("../../controllers/commentController");
const commentModel = require("../../models/commentsModel");

jest.mock("../../models/commentsModel");

describe("CommentController", () => {
  it("deve criar um comentário e retornar status 201", async () => {
    const req = {
      params: { id: 1 },
      body: { comment: "Bom filme!", commentRating: 5 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    commentModel.create.mockResolvedValueOnce({
      id: 1,
      movieId: 1,
      comment: "Bom filme!",
      commentRating: 5,
    });

    await commentController.createComment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      movieId: 1,
      comment: "Bom filme!",
      commentRating: 5,
    });
  });
});
