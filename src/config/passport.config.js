import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../utils.js";
import { UserService } from "../repositories/index.js";
import {CartService} from "../repositories/index.js"
import config from '../config/config.js';  

const localStrategy = local.Strategy;

const initializePassport = () => {
  UserService.findOne({ email: 'adminCoder@coder.com' })
    .then(admin => {
      if (!admin) {
        const adminUser = {
          first_name: 'Admin',
          last_name: 'Admin',
          email: config.admin.email,
          age: 25, 
          password: createHash(config.admin.password), 
          cart: null, 
          role: 'Admin'
        };

        UserService.create(adminUser)
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
          const user = await UserService.findOne({
            email: username,
          });
          if (user) {
            return done(null, false);
          }
          const cartForNewUser = await CartService.create({})
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
          const result = await UserService.create(newUser);
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
          const user = await UserService.findOne({
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
          const user = await UserService.findOne({
            email: profile._json.email,
          })
          if (user) {
            return done(null, user)
          }
          const cartForNewUser = await CartService.create({})
          const newUser = await UserService.create({
            first_name: profile._json.name,
            last_name: profile._json.name,
            email: profile._json.email,
            password: "",
            cart: cartForNewUser._id
          });
          return done(null, newUser);
        } catch (err) {
          return done(`Error to login with github: ${err.message}`)
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserService.getById(id);
    done(null, user);
  });
};

export default initializePassport;