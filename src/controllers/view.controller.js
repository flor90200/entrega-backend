import { getProducts } from "./product.controller.js"
import {PORT} from '../index.js'
import { getProductsFromCart } from "./cart.controller.js"
import {publicRoutes} from '../middewares/auth.middleware.js'


export const getViewProductController = (publicRoutes, async (req, res)=> {
    const result = await getProducts(req, res)
    if (result.statusCode === 200) {
        const totalPages = []
        let link 
        for (let index = 1; index <= result.response.totalPages; index++) {
            if (!req.query.page) {
                link = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${index}`
            } else {
                const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${index}`)
                link = `http://${req.hostname}:${PORT}${modifiedUrl}`
            }
            totalPages.push({ page: index, link})
        }
        const user = req.session.user
        console.log(user);
        res.render('home', { user, products: result.response.payload, paginateInfo: {
            hasPrevPage: result.response.hasPrevPage,
            hasNextPage: result.response.hasNextPage,
            prevLink: result.response.prevLink,
            nextLink: result.response.nextLink,
            totalPages
        }})
    } else {
        res.status(result.statusCode).json({ status: 'error', error: result.response.error })
    }
    }) 

export const getViewRealTimeProductsController = (publicRoutes, async (req, res) => {
    const result = await getProducts(req, res)
if (result.statusCode === 200) {
    res.render('realTimePRoducts', {products: result.response.payload})
} else {
    res.status(result.statusCode).json({ status: 'error', error: result.response.error})
}
})

export const getViewProductByIdController =  (publicRoutes, async (req, res) => {
    const result = await getProductsFromCart(req, res)
    if (result.statusCode === 200) {
        res.render('productsFromCart', { cart: result.response.payload })
    } else {
        res.status(result.statusCode).json({ status: 'error', error: result.response.error})
    }
})