import express from "express";
import { login, logout, signup } from "../controllers/AuthController";
import { handleRefreshToken } from "../controllers/refreshToken";
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/logout", logout);
router.get("/refresh", handleRefreshToken);

export default router;
