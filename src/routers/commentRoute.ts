import express from "express";
import {
  createComment,
  deleteComment,
  getPostComments,
  updateComment,
} from "../controllers/Post/commentController";

const router = express.Router();

router.get("/post/comment/:postId", getPostComments);
router.post("/comment/new/:userId/:postId", createComment);
router.delete("/comment/:commentId", deleteComment);
router.patch("/comment/:commentId", updateComment);

export default router;
