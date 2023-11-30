import { Router } from "express";
import { cartsManager } from "../db/managers/cartsManager.js";

const router = Router()

router.get("/:idCart", async (req, res) => {
  try{
    const { idCart } = req.params;
    const cart = await cartsManager.findCartById(idCart);
    res.json(cart);
  } catch (err){
    return res.status(500).json({ error: err.message });
  }
});

router.post("/:idCart/products/:idProduct", async (req, res) => {
  try{
    const { idCart, idProduct } = req.params;
    const cart = await cartsManager.addProductToCart(idCart, idProduct);
    res.json({ cart });
  } catch (err){
    return res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try{
    const cart = await cartsManager.createCart();
    res.json({ cart });
  } catch (err){
    return res.status(500).json({ error: err.message });
  }
});

router.put("/:cid/products/:pid", async (req,res) => {
  try{
    const {cid,pid} = req.params
    const quantity = req.body
    const cart = await cartsManager.quantityUpdate(cid,pid,quantity);
    res.json({ cart });
  } catch (err){
    return res.status(500).json({ error: err.message });
  }
})

router.put("/:cid", async (req,res) => {
  try{
    const {cid} = req.params
    const arrayProducts = req.body
    console.log(arrayProducts)
    const cart = await cartsManager.cartUpdate(cid,arrayProducts);
    res.json({ cart });
  } catch (err){
    return res.status(500).json({ error: err.message });
  }
})

router.delete("/:cid/products/:pid", async (req,res) => {
  try{
    const {cid,pid} = req.params
    const cart = await cartsManager.deleteProductOfCart(cid,pid);
    res.json({ cart });
  } catch (err){
    return res.status(500).json({ error: err.message });
  }
})

router.delete("/:cid", async (req,res) => {
  try{
    const {cid} = req.params
    const cart = await cartsManager.deleteCartProducts(cid);
    res.json({ cart });
  } catch (err){
    return res.status(500).json({ error: err.message });
  }
})


export default router;