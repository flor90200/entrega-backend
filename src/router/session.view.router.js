import {Router} from "express"
import { privateRoutes, publicRoutes } from "../middewares/auth.middleware.js"
import UserDTO from '../dto/user.dto.js'
import passport from "passport"
const router = Router()

router.get('/register', privateRoutes, async(req, res) => {
    res.render('sessions/register')
})

router.get('/', privateRoutes, (req, res) => {
    res.render('sessions/login')
})

router.get('/forget-password', (req, res) => {
    res.render('sessions/forget-password')
})

router.get('/reset-password/:token', (req, res) => {
    res.redirect(`/session/verify-token/${req.params.token}`)
})

router.get('/profile', publicRoutes, (req, res) => {
    const userDTO = new UserDTO(req.session.user)
    res.render('sessions/profile', userDTO)
})

export default router