import express from "express";

//Controller
import * as accountController from "../controllers/account.controller.js";

//Middleware
import { jwtAuthVerify } from "../middlewares/jwt.middleware.js";

const router = express.Router();

router.post("/", jwtAuthVerify, accountController.createAccount);
router.get("/", jwtAuthVerify, accountController.getAllAccounts);
router.get("/:id", jwtAuthVerify, accountController.getAccountById);
router.put("/:id", jwtAuthVerify, accountController.updateAccount);
router.delete("/:id", jwtAuthVerify, accountController.deleteAccount);

export default router;
