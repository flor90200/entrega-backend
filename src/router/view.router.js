import { Router } from "express";
import { getProducts } from "./product.routes.js";
import {getProductsFromCart} from "./carts.routes.js"
import { PORT } from "../index.js";


const router = Router()

router.get("/", async ( req, res) => {
    const result = await getProducts(req, res)
    if(result.statusCode === 200) {
        const totalPages = []
        let link
         for (let index = 1; index <= result.Response.totalPages; index++) {
            if (!req.query.page){
                link = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${index}`
            }else{
                const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`,(`page=${index}`)   )
                link = `http://${req.hostname}:${PORT}${modifiedUrl}`
              
            }
            totalPages.push({page: index, link})
         }
         res.render('home', {products: result.Response.payload, paginateInfo: {
            hasPrevPage: result.Response.hasPrevPage,
            hasNextPage: result.Response.hasNextPage,
            prevLink: result.Response.prevLink,
            nextLink: result.Response.nextLink,
            totalPages
         }
        })
    }else{
        res.status(result.statusCode).json({status: 'error', error: result.Response.error})
    }
})

router.get('/realTimeProducts', async (req, res)=>{
    const result = await getProductsFromCart(req,res)
    if(result.statusCode === 200) {
        res.render('productsFromCart', {cart: result.response.payload})
    }else{
        res.status(result.statusCode).json({status: 'error', error: result.response.error })
    }
})

export default router