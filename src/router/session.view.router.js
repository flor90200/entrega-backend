import { Router } from "express";
import { privateRoutes, publicRoutes } from "../middewares/auth.middleware";

const router = Router()

router.get('/register', privateRoutes, async(req, res) => {
    res.render('sessions/register')

})

router.get('/', privateRoutes, (req, res) => {
    res.render('sessions/login')
})

router.get('/profile', publicRoutes, ( req, res) => {
    res.render('sessions/profile', req.session.user)
})

export default router