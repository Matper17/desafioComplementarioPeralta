import { Router } from "express";
import {productsManager} from "../db/managers/productsManager.js"

const router = Router(); 

router.get("/", async (req, res)=>{
    try {
        const products = await productsManager.findAll()
        res.status(200).json({message: "Products", products})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.get("/:pid", async (req, res) =>{
    const {pid} = req.params
    try {
        const product = await manager.getProductById(+pid)
        console.log("product", product)
        if (!product){
            return res
            .status(404)
            .json({message: "Product not found try with other name"})
        }
        res.status(200).json({message:"Product found", product})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.post("/", async (req, res) =>{
    try {
        const createdProduct = await productsManager.createOne(req.body)
        res
        .status(200)
        .json({message: "Product created", product: createdProduct})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.delete("/idProduct", async(req, res)=>{
    const {idProduct} = req.params
    try {
        await productsManager.deleteOne(idProduct)
        res.status(200).json({message: "Product deleted"})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.put("/:pid", async(req, res) =>{
    const {pid} = req.params
    try {
        const response = await manager.updateProduct(+pid, req.body)
        if(!response){
            return res
            .status(404)
            .json({message: "Product not found"})
        }
        res.status(200).json({message:"Update product"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }

}) 

export default router; 