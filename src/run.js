import productRouter from "./router/product.routes.js"
import cartRouter from "./router/carts.routes.js"
import chatRouter from "./router/chat.router.js"
import messagesModel from "./dao/managers/messageModel.js";
import productViewsRouter from './router/session.view.router.js'
import sessionRouter from './router/session.router.js'


const run = (socketServer, app) => {
    app.use((req, res, next) => {
        req.io = socketServer
        next()
    })

    app.use("/products", productViewsRouter)
    app.use("/session", sessionRouter)


    app.use("/api/products", productRouter)
    app.use("/api/carts", cartRouter)
    app.use("/api/chat", chatRouter)


    socketServer.on("connection", socket => {
        console.log("New client connected")
        socket.on("message", async data => {
        await messagesModel.create(data)
        let messages = await messagesModel.find().lean().exec()
        socketServer.emit("logs", messages)
        })
    })

    app.use("/", (req, res) => res.send("HOME"))

}

export default run