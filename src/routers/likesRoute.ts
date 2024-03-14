import express from "express";
import {
  getLikes,
  likePost,
  unlikePost,
} from "../controllers/Post/likeController";

const router = express.Router();

router.get("/post/likes/:postId", getLikes);
router.get("/post/likepost/:postId/:userId", likePost);
router.get("/post/unlikepost/:postId/:likeId", unlikePost);

export default router;
