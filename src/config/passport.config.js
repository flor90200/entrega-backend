import local from 'passport-local'
import passport from "passport"
import GitHubStrategy from "passport-github2"
import UserModel from "../dao/managers/user.model.js"
import { createHash, isValidPassword } from "../utils.js"

const localStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new localStrategy({
        passReqToCallback: true,
        userNameField: 'email'
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age } = req.body
        try {
            const user = await UserModel.findOne({ email: username})
            if (!user) {
                return done (null, false)
            }
            const userRegister = {
                first_name, last_name, email, age, password: createHash(password)
            }
            const result = await UserModel.create(userRegister)
            return done (null, result)
        } catch(err) {
            return done(err)
        }
    
    }))

    passport.use('login', new localStrategy({
        userNameField: 'email',
    }, async (username, password, done) => {
        try {
            const user = await UserModel.findOne({email: username})
            if (!user) {
                return done(null, false)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        }catch(err) {}
    
    }))

    passport.use('github', new GitHubStrategy({
        clientID:  'Iv1.96e558afbecdaef1',
        clientSecret: ' 38ed40761aa93cfe5003141482b0b0c65d9a2681',
        callbackURL: 'http://localhost:8080/session/githubcallback'
    }, async(accessToken, refreshToken, profile, done) => {
        console.log(profile)
        done(null, profile)
        try{
            const user = await UserModel.findOne({email: profile._json.email})
            if(user) return done(null, user)
            const newUser = await UserModel.create({
                first_name: profile._json.name,
                last_name: '',
                email: profile._json.email,
                password: ''
        })
        return done(null, newUser)
        } catch(err) {
            return done ('error to login with github')
        }
    }))

    passport.serializeUser((user, done) =>{
        done(null, user._id)

    })

    passport.deserializeUser(async(id, done) =>{
        const user = await UserModel.findById(id)
        done(null, user)
    })
}

export default initializePassport