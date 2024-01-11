import { Router } from "express";
import { getAllProductsController, getProductByIdController, createProductController, updateProductController, deleteProductController } from "../controllers/product.controller.js"
import { handlePolicies } from "../middewares/auth.middleware.js";

const router = Router();

router.get('/', handlePolicies(['USER', 'ADMIN',  'PREMIUM']), getAllProductsController);
router.get("/:pid",handlePolicies(['USER', 'ADMIN']),   getProductByIdController);
router.post("/", handlePolicies([ 'PREMIUM', 'ADMIN']),  createProductController);
router.put("/:pid", handlePolicies([ 'PREMIUM','ADMIN']), updateProductController);
router.delete("/:pid", handlePolicies([ 'PREMIUM', 'ADMIN']), deleteProductController);

export default router;