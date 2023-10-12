import { Router } from "express";
import UserModel from "../dao/managers/user.model";
import router from "./carts.routes";
import passport, { session } from "passport";


const routes = Router()

router.get('/register', (req, res) => {
    res.render('session/register')
})

router.post('/register', passport.authenticate('register', {failureRedirect: '/session/failRegister'}), async (req, res) => {
    res.redirect('/sessions/login')
})

router.get('/failRegister', (req, res) => res.send({ error: 'passport register failed'}))




router.get('/login', (req, res) => {
    res.render('sessions/login')
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/session/failLogin'}), async (req, res)  => {
   if (!req.user) {
    return res.status(400).send({ status: 'error', error: 'invalid' })
   }

   req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age
   }
    res.redirect('/products')

})

router.get('/failLogin' , (req, res) => res.send ({ error: 'passport' }))




router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err){
            console.log (err);
            res.status(500).render('error/base', {error: err})
        }else res.redirect('/sessions/login')
    })
})


export default router