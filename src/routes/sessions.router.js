import { Router } from "express";
import {usersManager} from "../db/managers/usersManager.js"

const router = Router()

router.post("/signup", async (req, res) =>{
    const {first_name, last_name, email, password} = req.body; 
    if(!first_name || !last_name || !email || !password){
        return res.status(400).json({message: "Todos los campos son requeridos"})
    }
    try {
        const createdUser = await usersManager.createOne(req.body)
        res.status(200).json({message: "Usuario creado con éxito", user: createdUser})
    } catch (error) {
        res.status(500).json({error})
    }
})

router.post("/login", async(req, res) =>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({message: "Todos los campos son requeridos"})
    }
    try {
        const user = await usersManager.findByEmail(email)
        if (!user){
            return res.redirect("/signup")
        }
        const isPasswordValid = password === user.password
        if(!isPasswordValid){
            return res.status(401).json({message: "La contraseña es incorrecta"})
        }
        const sessionInfo =
        email === "matiasperalta_17@hotmail.com" && password === "matias1234"
        ? {email, first_name: user.first_name, isAdmin: true}
        : {email, first_name: user.first_name, isAdmin: false}
        req.session.user = sessionInfo
        res.redirect("/profile")
    } catch (error) {
        res.status(500).json({error})
    }
})

router.get("/signout", (req, res) =>{
    req.session.destroy(() =>{
        res.redirect("/login")
    })
})

export default router; 