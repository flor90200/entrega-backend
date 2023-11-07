import { Router } from "express";
import { getAllProductsController, getProductByIdController, createProductController, updateProductContoller, deleteProductController } from "../controllers/product.controller.js"


const router = Router();

router.get('/', getAllProductsController);
router.get("/:pid",  getProductByIdController);
router.post("/", createProductController);
router.put("/:pid", updateProductContoller);
router.delete("/:pid", deleteProductController);


export default router