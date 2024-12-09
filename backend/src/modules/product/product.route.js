import express from "express";
import * as productController from "./product.controller.js";
import { verifyToken } from "../../utils/verifyUser.js";
import { validateZod } from "../../middlewares/validate-zod.js";
import { productSchema } from "./product.shcema.js";

const router = express.Router();

// Create a product
router.post(
  "/create",
  verifyToken,
  validateZod(productSchema),
  productController.createProduct
);

// Get all products
router.get("/get", verifyToken, productController.getAllProducts);

// Get a product by ID
router.get("/:id", verifyToken, productController.getProductById);

// Update a product by ID
router.put("/update/:id", verifyToken, productController.updateProduct);

// Delete a product by ID
router.delete("/delete/:id", verifyToken, productController.deleteProduct);

export default router;
