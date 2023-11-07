import local from 'passport-local'
import passport from "passport"
import passport_jwt from 'passport-jwt'
import GitHubStrategy from "passport-github2"
import UserModel from "../dao/managers/user.model.js"
import { createHash, isValidPassword } from "../utils.js"
import cartModel from '../dao/cart.model.js'
import config from '../config/config.js'

const localStrategy = local.Strategy;

const initializePassport = () => {
  UserModel.findOne({ email: 'adminCoder@coder.com' })
    .then(admin => {
      if (!admin) {
        const adminUser = {
          first_name: 'Admin',
          last_name: 'Admin',
          email: config.admin.email,
          age: 25, 
          password: createHash(config.admin.password), 
          cart: null, 
        };

        UserModel.create(adminUser)
          .then(result => {
            console.log('Usuario administrador creado con éxito.');
          })
          .catch(err => {
            console.error('Error al crear el usuario administrador:', err);
          });
        } })

  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await UserModel.findOne({
            email: username,
          });
          if (user) {
            return done(null, false);
          }
          const cartForNewUser = await cartModel.create({})
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: cartForNewUser._id, 
            role: (email === 'adminCoder@coder.com') ? 'admin' : 'user'
          };
          await cartForNewUser.save()
          const result = await UserModel.create(newUser);
          return done(null, result);
        } catch (err) {
          return done('error al obtener el user');
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({
            email: username,
          });
          if (!user) {
            return done(null, false);
          }
          if (!isValidPassword(user, password)) return done(null, false);
          
          return done(null, user);
        } catch (err) {}
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.github.clientId,
        clientSecret: config.github.githubSecret,
        callbackURL: config.github.githubCallbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          const user = await UserModel.findOne({
            email: profile._json.email,
          });
          if (user) return done(null, user);
          const newUser = await UserModel.create({
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            password: "",
          });
          return done(null, newUser);
        } catch (err) {
          return done("error to login with github");
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;