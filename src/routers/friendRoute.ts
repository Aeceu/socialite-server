import express from "express";
import {
  addFriend,
  getFriends,
  getSearch,
  getUserNotFriends,
  removeFriend,
} from "../controllers/Post/friendController";

const router = express.Router();

router.get("/user/friends/:userId", getFriends);
router.post("/user/addFriend/:userId/:friendId", addFriend);
router.get("/user/unFriend/:userId/:friendId", removeFriend);
router.get("/users/:userId", getUserNotFriends);
router.get("/searchUser/:search", getSearch);

export default router;
