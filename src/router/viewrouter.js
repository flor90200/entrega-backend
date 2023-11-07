import { Router } from "express";
import { getViewProductController, getViewRealTimeProductsController, getViewProductByIdController } from "../controllers/view.controller.js"

const router = Router()

router.get("/", getViewProductController) 
router.get('/realTimeProducts', getViewRealTimeProductsController) 
router.get('/:cid', getViewProductByIdController)

export default router