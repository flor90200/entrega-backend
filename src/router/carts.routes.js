/*import { Router } from "express";
import CartManager from "../controllers/CartManager.js";


const CartRouter = Router();
const carts = new CartManager

CartRouter.post("/", async (req, res) => {
res.send(await carts.addCarts())
})
CartRouter.get("/", async (req, res) => {
    res.send(await carts.readCarts())
})

CartRouter.get("/:id", async (req, res) => {
    res.send(await carts.getCartsById(req.params.id))
})

CartRouter.post("/:cid/products/:pid", async (req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    res.send(await carts.addProductInCart(cartId, productId))
})

export default CartRouter//*/
import { Router } from 'express'
import productModel from '../dao/managers/product.model.js'
import cartModel from "../dao/cart.model.js"

const router = Router()

export const getProductsFromCart = async (req, res) => {
    try {
        const id = req.params.cid
        const result = await cartModel.findById(id).populate('products.product').lean()
        if (result === null) {
            return {
                statusCode: 404,
                response: { status: 'error', error: 'Not found' }
            }
        }
        return {
            statusCode: 200,
            response: { status: 'success', payload: result }
        }
    } catch(err) {
        return {
            statusCode: 500,
            response: { status: 'error', error: err.message }
        }
    }
}

router.post('/', async (req, res) => {
    try {
        const result = await cartModel.create({})
        res.status(201).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.get('/:cid', async (req, res) => {
    const result = await getProductsFromCart(req, res)
    res.status(result.statusCode).json(result.response)
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cartToUpdate = await cartModel.findById(cid)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
        }
        const productToAdd = await productModel.findById(pid)
        if (productToAdd === null) {
            return res.status(404).json({ status: 'error', error: `Product with id=${pid} Not found` })
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if ( productIndex > -1) {
            cartToUpdate.products[productIndex].quantity += 1
        } else {
            cartToUpdate.products.push({ product: pid, quantity: 1 })
        }
        const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(201).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cartToUpdate = await cartModel.findById(cid)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
        }
        const productToDelete = await productModel.findById(pid)
        if (productToDelete === null) {
            return res.status(404).json({ status: 'error', error: `Product with id=${pid} Not found` })
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if ( productIndex === -1) {
            return res.status(400).json({ status: 'error', error: `Product with id=${pid} Not found in Cart with id=${cid}` })
        } else {
            cartToUpdate.products = cartToUpdate.products.filter(item => item.product.toString() !== pid)
        }
        const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.put('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const cartToUpdate = await cartModel.findById(cid)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
        }
        const products = req.body.products
        //start: validaciones del array enviado por body
        if (!products) {
            return res.status(400).json({ status: 'error', error: 'Field "products" is not optional' })
        }
        for (let index = 0; index < products.length; index++) {
            if (!products[index].hasOwnProperty('product') || !products[index].hasOwnProperty('quantity')) {
                return res.status(400).json({ status: 'error', error: 'product must have a valid id and a valid quantity' })
            }
            if (typeof products[index].quantity !== 'number') {
                return res.status(400).json({ status: 'error', error: 'product\'s quantity must be a number' })
            }
            if (products[index].quantity === 0) {
                return res.status(400).json({ status: 'error', error: 'product\'s quantity cannot be 0' })
            }
            const productToAdd = await productModel.findById(products[index].product)
            if (productToAdd === null) {
                return res.status(400).json({ status: 'error', error: `Product with id=${products[index].product} doesnot exist. We cannot add this product to the cart with id=${cid}` })
            }
        }
        //end: validaciones del array enviado por body
        cartToUpdate.products = products
        const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cartToUpdate = await cartModel.findById(cid)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
        }
        const productToUpdate = await productModel.findById(pid)
        if (productToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Product with id=${pid} Not found` })
        }
        const quantity = req.body.quantity
        //start: validaciones de quantity enviado por body
        if (!quantity) {
            return res.status(400).json({ status: 'error', error: 'Field "quantity" is not optional' })
        }
        if (typeof quantity !== 'number') {
            return res.status(400).json({ status: 'error', error: 'product\'s quantity must be a number' })
        }
        if (quantity === 0) {
            return res.status(400).json({ status: 'error', error: 'product\'s quantity cannot be 0' })
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if ( productIndex === -1) {
            return res.status(400).json({ status: 'error', error: `Product with id=${pid} Not found in Cart with id=${cid}` })
        } else {
            cartToUpdate.products[productIndex].quantity = quantity
        }
        //end: validaciones de quantity enviado por body
        const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const cartToUpdate = await cartModel.findById(cid)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
        }
        cartToUpdate.products = []
        const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

export default router