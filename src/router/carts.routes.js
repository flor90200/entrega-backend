import { Router } from "express"
import { createCartContoller, getCartByIdContoller, createCartProductController, deleteCartProductController, updateProductCartContoller, deleteCartcontroller } from '../controllers/cart.controller.js'


const router = Router()

router.post('/', createCartContoller)
router.get('/:cid', getCartByIdContoller)
router.post('/:cid/product/:pid',  createCartProductController)
router.delete('/:cid/product/:pid', deleteCartProductController)
router.put('/:cid', updateProductCartContoller)
router.delete('/:cid', deleteCartcontroller)


export default router