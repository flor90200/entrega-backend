import express  from "express";
import {Server} from "socket.io"
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from 'connect-mongo'
import productsRoutes from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import viewsRouter from './router/view.router.js'
import chatRouter from './router/chat.router.js'
import Sockets from './sockets.js'
//import * as path from "path";
import __dirname from "./utils.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";




const MONGO_URI = 'mongodb://localhost:27017'
const MONGO_DB_NAME = 'ecommerce'
export const PORT = 8080

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        dbName: MONGO_DB_NAME
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(express.static('./src/public'))
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

try {
    await mongoose.connect(MONGO_URI, { 
        dbName: MONGO_DB_NAME,
        useUnifiedTopology: true
    })
    console.log('DB connected!')
    const server = app.listen(PORT, () => console.log('Server Up'))
    const io = new Server(server)
    app.use((req, res, next) => {
        req.io = io
        next()
    })

    initializePassport()
    app.use(passport.initialize())
    app.use(passport.session())

    app.get('/', sessionViewRouter)
    app.use('/api/products', productsRoutes)
    app.use('/api/carts', CartRouter)
    app.use('/products', viewsRouter)
    app.use('/carts', viewsRouter)
    app.use("/chat", chatRouter)

    Sockets(io)
} catch(err) {
    console.log('Cannot connect to DB :(  ==> ', err.message)
    process.exit(-1)
}










