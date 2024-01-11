import express  from "express";
import {Server} from "socket.io";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from 'connect-mongo';
import Sockets from './sockets.js';
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import config from "./config/config.js";
import cartrouter from './router/carts.routes.js'
import productrouter from './router/product.routes.js';
import viewrouter from './router/viewrouter.js'
import chatrouter from './router/chat.router.js'
import sessionviewrouter from './router/session.view.router.js'
import sessionrouter from './router/session.router.js'
import checkoutrouter from './router/checkoutrouter.js'
import generateProductrouter from './router/generateProduct.router.js'
import loggerrouter from './router/routerlogger.js'
import errorHandler from './middewares/error.js'
import logger from "./logger.js";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

export const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
    title: 'Ecommerce Flower Style',
    description: ' Esta API proporciona acceso a los recursos de una tienda de servicios online, incluyendo productos, categorías, carrito de compras, y más.',
    version: '1.0.0',
  }
  },
  apis: [
    `./docs/**/*.yaml`,
  ],
}
const specs = swaggerJsdoc(swaggerOptions)

const MONGO_URI = config.mongo.uri
const MONGO_DB_NAME = config.mongo.dbname
export const PORT = config.apiserver.port



const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/docs', swaggerUiExpress.serve,swaggerUiExpress.setup(specs));


app.use(session ({
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    dbName: MONGO_DB_NAME
  }),
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())




// setear handlebars
app.use(express.static('/public'))
app.engine('handlebars', handlebars.engine())
app.set('views', '/views')
app.set('view engine', 'handlebars')


try {
  await mongoose.connect(MONGO_URI , {
   dbName: MONGO_DB_NAME ,
   useUnifiedTopology: true
  })
   logger.info('DB connected');
  const server = app.listen(PORT, () => logger.http('server up'))
  const io = new Server(server)
  app.use((req, res, next) => {
    req.io = io
    next()
  })


app.use('/', sessionviewrouter)
app.use('/api/products', productrouter)
app.use('/api/carts', cartrouter)
app.use('/session', sessionrouter)
app.use('/products', viewrouter )
app.use('/carts', viewrouter)
app.use('/chat', chatrouter)
app.use('/checkout', checkoutrouter)
app.use('/mockingproducts', generateProductrouter)
app.use('/loggerTest', loggerrouter)
app.use(errorHandler)

Sockets(io)

} catch(err){
  console.log('Cannot connet to DB', err.message)
  process.exit(-1)
}



