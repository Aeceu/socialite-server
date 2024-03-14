import express from "express";

import {
  allSharedPosts,
  createSharedPost,
  deleteSharedPost,
  getSharedPostById,
  getUserSharedPosts,
  updateSharedPost,
} from "../controllers/SharedPost/SharedPostController";

import {
  getSharedPostLikes,
  likesSharedPost,
  unlikeSharedPost,
} from "../controllers/SharedPost/LikeSharedPost";

import {
  createSharedPostComment,
  deleteComment,
  getSharedPostComments,
  updateComment,
} from "../controllers/SharedPost/commentController";

const router = express.Router();

router.get("/usersharedposts/:userId", getUserSharedPosts);
router.get("/sharepost/:sharedpostId", getSharedPostById);
router.get("/allsharedposts", allSharedPosts);
router.post("/sharepost/:userId/:postId", createSharedPost);
router.patch("/sharepost/:sharedpostId", updateSharedPost);
router.delete("/sharepost/:sharedPostId", deleteSharedPost);

router.get("/sharedpost/likes/:sharedPostId", getSharedPostLikes);
router.get("/sharedpost/likepost/:sharedPostId/:userId", likesSharedPost);
router.get("/sharedpost/unlikepost/:sharedPostId/:likeId", unlikeSharedPost);

router.get("/sharedpost/comment/:sharedPostId", getSharedPostComments);
router.post(
  "/sharedpost/comment/new/:userId/:sharedPostId",
  createSharedPostComment
);
router.delete("/sharedpost/comment/:commentId", deleteComment);
router.patch("/sharedpost/comment/:commentId", updateComment);
export default router;
