
import passport from "passport"
import UserModel from "../dao/managers/user.model.js"
import { createHash, isValidPassword } from "../utils.js"

const localStrategy = local.localStrategy

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

    passport.serializeUser((user, done) =>{
        done(null, user._id)

    })

    passport.deserializeUser(async(id, done) =>{
        const user = await UserModel.findById(id)
        done(null, user)
    })
}

export default initializePassport