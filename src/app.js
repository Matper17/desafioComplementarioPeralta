import express from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/cart.router.js"
import usersRouter from "./routes/users.router.js"
import sessionsRouter from "./routes/sessions.router.js"
import { messagesManager } from "./db/managers/messagesManager.js";
import { productsManager } from "./db/managers/productsManager.js";
import session from "express-session";
import { Server } from "socket.io";
import "./db/configDB.js";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./passport.js"

const app = express()

//Mongo DB

const URI = "mongodb+srv://clientUser:coderhouse23@tiendavirtualcluster.j1fv3uh.mongodb.net/?retryWrites=true&w=majority"
app.use(
    session({
        store: new MongoStore({
            mongoUrl: URI,
        }),
        secret: "secretSession",
        cookie: {maxAge: 60000}
    })
)
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use(cookieParser("SecretCookie"))

//Passport

app.use(passport.initialize())
app.use(passport.session())

//Handlebars 

app.engine("handlebars", engine())
app.set("views", __dirname, "views")
app.set("view engine", "handlebars")
//app.use(express.static('public'));

//Routes

app.use("/api/products", productsRouter)
app.use("/", viewsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/users", usersRouter)
app.use("/api/sessions", sessionsRouter)


const PORT = app.listen(8080, () =>{
    console.log("Escuchando al puerto 8080")
})

const socketServer = new Server (PORT)
socketServer.on("Connection", (socket) =>{
    socket.on("newMessage", async(message) =>{
        await messagesManager.createOne(message)
        const messages = await messagesManager.findAll()
        socketServer.emit("sendMessage", messages)
    })
    socket.on("showProducts", async() =>{
        const products = await productsManager.findAll({limit: 10, page: 1, sort:{}, query:{}})
        socketServer.emit("sendProducts", products)
    })
})