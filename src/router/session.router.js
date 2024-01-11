import { Router } from "express";
import passport from "passport";
import UserPasswordModel from "../models/user-password.model.js";
import { UserService } from "../repositories/index.js";
import {generateRandomString, createHash} from '../utils.js'
import { PORT } from "../index.js";
import config from "../config/config.js";
import nodemailer from 'nodemailer'
import { isValidPassword } from "../utils.js";

const router = Router();

router.post("/register", passport.authenticate("register", {failureRedirect: "/session/failRegister",
  }),
  async (req, res) => {
    res.redirect("/");
  }
);

router.get("/failRegister", (req, res) =>
  res.send({ error: "Passport register failed" })
);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/session/failLogin" }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .send({ status: "error", error: "Invalid credentials" });
    }
    req.session.user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      password: req.user.password,
      cart: req.user.cart,
      role: req.user.role,
      __v: req.user.__v
    } 
  
    res.redirect("/products");
  }
);

router.get("/failLogin", (req, res) =>
  res.send({ error: "Passport login failed" })
);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).render("errors/base", { error: err });
    } else res.redirect("/");
  });
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), (req, res) => {

  });

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    console.log("Callback:", req.user);
    req.session.user = req.user;
    res.redirect("/products");
  }
);

router.get('/current', (req, res) => {
  if (!req.session.user)return res.status(401).json({ status: 'error', error: 'No session detected! (You are not logged-in)' })
  res.status(200).json({ status: 'success', payload: req.session.user }) 
})
outer.post('/forget-password', async (req, res) => {
  const email = req.body.email
  const user = await UserService.findOne({ email })
  if (!user) {
    return res.status(404).json( { status: 'error', error: 'user not found'})
  }
  const token = generateRandomString(16)
  await UserPasswordModel.create({ email, token })
  const mailerConfig = {
    service: 'gmail',
    auth: { user: config.checkout.checkoutUser, pass: config.checkout.checkoutPass }
  }
  let transporter = nodemailer.createTransport(mailerConfig)
  let message = {
    from: config.checkout.checkoutUser,
    to: email,
    subject: '[Look Fashion  e-comm API] Reset your password ',
    html: `<h1>[Look Fashion e-comm API] Reset yout password</h1><hr />You have asked to reset your password. You can do it here: <a href="http://${req.hostname}:${PORT}/reset-password/${token}">http://${req.hostname}:${PORT}/reset-password/${token}</a><hr />Best regards,<br><strong>Look Fashion e-comm API team</strong>`
  }
  try {
    await transporter.sendMail(message)
    res.json({ status: 'success', message: `Email successfully sent to ${email} in order to reset password`})
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message})
  }

})

router.get('/verify-token/:token', async (req, res) => {
  const userPassword = await UserPasswordModel.findOne({ token: req.params.token})
  if (!userPassword) {
    return res.status(404).json({ status: 'error', error: 'Token no válido / El token ha expirado'})
    
  }
  const user = userPassword.email
  res.render('sessions/reset-password', { user })
})

router.post('/reset-password/:user', async (req, res) => {
  try {
    const user = await UserService.findOne({ email: req.params.user})
 // Verifica si la nueva contraseña es diferente de la actual
 const isSamePassword = isValidPassword(user, req.body.newPassword);

 if (isSamePassword) {
   return res.json({ status: 'error', error: 'La nueva contraseña debe ser diferente de la actual' });
 }

    await UserService.update(user._id, { password: createHash(req.body.newPassword) })
    res.json({ status: 'success', message: 'Se ha creado una nueva contraseña'})
    await UserPasswordModel.deleteOne({ email:req.params.user})
  } catch(err) {
    res.json({ status: 'error', error: err.message})
  }
  res.render('/')
})

router.get('/premium/:uid', async (req, res) => {
  try {
    const user = await UserService.getById(req.params.uid)
    
    await UserService.update(req.params.uid, { role: user.role === 'user' ? 'premium' : 'user'})
    res.json({ status: 'success', message: 'Se ha actualizado el rol del usuario'})
  } catch(err) {
    console.error(err);
     res.json({ status: 'error', error: err.message})
  }
})


export default router;