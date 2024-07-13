import express from "express";

//Controller
import * as transactionController from "../controllers/transaction.controller.js";

//Middleware
import { jwtAuthVerify } from "../middlewares/jwt.middleware.js";

const router = express.Router();

router.get("/", jwtAuthVerify, transactionController.get);
router.get(
  "/chart/area",
  jwtAuthVerify,
  transactionController.getAreaChartData
);
router.get("/info-cards", jwtAuthVerify, transactionController.getInfoCards);
router.get("/:id", jwtAuthVerify, transactionController.getById);
router.post("/", jwtAuthVerify, transactionController.create);
router.put("/:id", jwtAuthVerify, transactionController.update);
router.delete("/:id", jwtAuthVerify, transactionController.remove);

export default router;
