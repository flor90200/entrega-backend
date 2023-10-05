import { Router } from "express";
import UserModel from "../dao/managers/user.model";
import router from "./carts.routes";

const routes = Router()

router.post('/regiter', async (req, res) => {
    const userRegister = req.body
    const user = new UserModel(userRegister)
    await user.save()
    res.redirect('/')
})

router.post('/login', async (req, res)  => {
    const { email, password } = req.body
    const user = await UserModel.findOne({email, password}).lean().exec()
    if(!user) {
        return res.redirect('/')
    }
    if (user.email === 'asd@asd.com' && user.password === 'asd123') {
        user.role = 'admin'
    } else{
        user.role = 'user'
    }
    req.session.user = user
    res.redirect('/products')

})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err){
            console.log (err);
            res.status(500).render('error/base', {error: err})
        }else res.redirect('/')
    })
})


export default router