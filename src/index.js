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



const MONGO_URI = config.mongo.uri
const MONGO_DB_NAME = config.mongo.dbname
export const PORT = config.apiserver.port


const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
  console.log('DB connected');
  const server = app.listen(PORT, () => console.log('server up'))
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


Sockets(io)

} catch(err){
  console.log('Cannot connet to DB', err.message)
  process.exit(-1)
}



