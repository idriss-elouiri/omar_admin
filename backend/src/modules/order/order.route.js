import express from "express";
import * as orderController from "./order.controller.js";
const router = express.Router();

// Create a product
router.post("/create", orderController.create);
router.get("/get", orderController.getAll);
router.put("/update-status", orderController.updateStatus); // تحديث حالة الطلب

export default router;
