import express from "express";

//Controller
import * as userController from "../controllers/user.controller.js";

//Middleware
import { jwtAuthVerify } from "../middlewares/jwt.middleware.js";

const router = express.Router();

router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);
router.get("/", jwtAuthVerify, userController.get);
router.put("/", jwtAuthVerify, userController.update);
router.put("/change-password", jwtAuthVerify, userController.changePassword);

export default router;
