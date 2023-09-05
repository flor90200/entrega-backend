import express  from "express";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import { engine } from "express-handlebars";
import * as path from "path";
import __dirname from "./utils.js";
import ProductManager from "./controllers/ProductManager.js";
import {Server} from "socket.io"


const app = express();
const PORT = 4000;
const product = new ProductManager();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"))

//static
app.use("/", express.static(__dirname + "/public"))

app.get("/", async (req, res) => {
    let allProducts = await product.getProducts();
    res.render("home", {
        title: "Flower Style",
        products: allProducts
    })
})

app.get("/:id", async (req, res) => {
   console.log(req.params)
    let prod = await product.getProductsById(req.params.id)
    res.render("prod", {
        title: "Flower Style",
        products: prod
    })
})

app.use("/api/products", ProductRouter);
app.use("/api/cart", CartRouter);


const hhtpServer=app.listen (PORT, () => {
    console.log(`Servidor Express puerto ${PORT}`);
});


const socketServer = new Server(hhtpServer)


const pmanagersocket =new ProductManager(__dirname+"/models/products.json")

socketServer.on("connection",async(socket)=>{
    console.log("client connected", socket.id)
    const readProducts=await pmanagersocket.getProducts({})
    socketServer.emit("enviodeproducts",readProducts)

    socket.on("addProduct", async(obj)=>{
        await pmanagersocket.addProducts(obj)
        const readProducts=await pmanagersocket.getProducts({})
        socketServer.emit("enviodeproducts", readProducts)
    })


socket.on("deleteProduct",async(id)=>{
await pmanagersocket.deleteProducts(id)
const readProducts =await pmanagersocket.getProducts({})
socketServer.emit("enviodeproducts", readProducts)
})

})