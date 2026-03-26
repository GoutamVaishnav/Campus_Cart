import express from "express";
import { initiateChat } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/initiate", authMiddleware, initiateChat);

export default router;
