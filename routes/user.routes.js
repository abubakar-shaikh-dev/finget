import express from "express";

import * as userController from "../controllers/user.controller.js";

const router = express.Router();

router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);

export default router;
