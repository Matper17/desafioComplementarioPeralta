import { Router } from "express";
import { cartsManager } from "../db/managers/cartsManager.js";
import { productsManager } from "../db/managers/productsManager.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("websocket");
});

router.get("/home", (req, res) => {
    res.render("home");
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

router.get("/products", async (req, res) => {
  try {
    const products = await productsManager.findAll({limit:10, page:1, sort:{}, query:{} }).lean()
    const docs = products.payload.docs
    res.render("products",{products: docs});
  } catch (error) {
    return error
  }
});

router.get("/carts/:cid", async(req,res)=>{
  try {
    const {cid} = req.params
    const cart = await cartsManager.findCartById(cid)
    const products = cart.products
    res.render("cart",{products})
    console.log(products)
  } catch (error) {
    return error
  }
})


router.get("/login",(req,res)=>{
  res.render("login")
})

router.get("/signup",(req,res)=>{
  res.render("signup")
})


router.get("/error",(req,res)=>{
  res.render("/error")
})

export default router;