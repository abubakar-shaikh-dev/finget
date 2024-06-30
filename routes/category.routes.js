import express from "express";

//Controller
import * as categoryController from "../controllers/category.controller.js";

//Middleware
import { jwtAuthVerify } from "../middlewares/jwt.middleware.js";

const router = express.Router();

router.post("/", jwtAuthVerify, categoryController.create);
router.get("/", jwtAuthVerify, categoryController.get);
router.get("/chart/donut", jwtAuthVerify, categoryController.getDonutChartData);
router.get("/:id", jwtAuthVerify, categoryController.getById);
router.put("/:id", jwtAuthVerify, categoryController.update);
router.delete("/:id", jwtAuthVerify, categoryController.remove);

export default router;
