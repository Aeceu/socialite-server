import express from "express";
import {
  deleteUser,
  getUsers,
  updateUser,
  getUserById,
  updateUserProfileImage,
  updateUserCoverPhoto,
  getUserFriendsById,
} from "../controllers/userController";
const router = express.Router();

router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

router.patch("/user/profile/:userId", updateUserProfileImage);
router.patch("/user/cover/:userId", updateUserCoverPhoto);
router.get("/friends/:userId", getUserFriendsById);
export default router;
