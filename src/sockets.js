import messageModel from './dao/managers/messageModel.js'
import { Socket } from "socket.io"

export default (id) => {
io.on ('connection', async Socket => {
    console.log(`CONNECTED`)
    Socket.on('productList', data => {
        io.emit('updatedProducts', data)

        })
        Socket.broadcast.emit('alerta')
        let message = await messageModel.find().lean().exec()
        Socket.on('message', async data => {
            await messageModel.create(data)
            let message = await messageModel.find().lean().exec()
            io.emit('logs', message)
        })
    })

}