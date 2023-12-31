import { Router } from "express";
import passport from "passport";



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

export default router;