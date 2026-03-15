import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStatus,
  getMyProducts,
  searchProducts,
  latestProducts,
} from "./buy.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/latest", latestProducts);
router.get("/products/search", searchProducts);
router.get("/products/:id", getProductById);

router.post(
  "/products",
  authMiddleware,
  upload.array("images", 4),
  createProduct,
);

router.put(
  "/products/:id",
  authMiddleware,
  upload.array("images", 4),
  updateProduct,
);

router.delete("/products/:id", authMiddleware, deleteProduct);

router.patch("/products/:id/status", authMiddleware, updateStatus);

router.get("/my-products", authMiddleware, getMyProducts);

export default router;
