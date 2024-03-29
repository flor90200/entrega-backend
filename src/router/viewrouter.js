import { Router } from "express"
import { publicRoutes, handlePolicies } from '../middewares/auth.middleware.js'
import { 
    getViewProductController, getViewRealTimeProductsController, getViewProductByIdController 
} from '../controllers/view.controller.js'

const router = Router()

router.get("/", getViewProductController) 
router.get('/realTimeProducts', handlePolicies(['USER', 'ADMIN', 'PREMIUM']), getViewRealTimeProductsController) 
router.get('/:cid', handlePolicies(['USER', 'ADMIN', 'PREMIUM']), getViewProductByIdController)

export default router