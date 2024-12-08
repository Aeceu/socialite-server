import express from "express";
import {
  allPosts,
  createPost,
  deletePost,
  getFeed,
  getPostById,
  getUserPosts,
  updatePost,
} from "../controllers/Post/postController";
const router = express.Router();

router.get("/userposts/:userId", getUserPosts);
router.get("/post/:postId", getPostById);
router.get("/allposts?", allPosts);
router.post("/newpost/:userId", createPost);
router.patch("/post/:postId", updatePost);
router.delete("/post/:postId", deletePost);
router.get("/api/feed", getFeed);

export default router;
