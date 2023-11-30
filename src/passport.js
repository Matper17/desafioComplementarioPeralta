import passport from "passport";
import { usersManager } from "./db/managers/usersManager.js"
import { Strategy as GithubStrategy } from "passport-github";
import { Strategy as LocalStrategy } from "passport-local";
import { hashData, compareData } from "./utils.js"

passport.serializeUser ((user, done) =>{
    done(null, user._id)
})

passport.deserializeUser(async(id, done)=>{
    try {
        const user = await usersManager.findById(id)
        done (null, user)
    } catch (error) {
        done (error)
    }
})

passport.use("signup", new LocalStrategy({passReqToCallback: true, usernameField: "email"}, async(req, email, password, done)=>{
    const {first_name, last_name} = req.body
    if (!first_name || !last_name || !email || !password){
        return done(null, false)
    }
    try {
        const hashedPassword = await hashData(password)
        const createdUser = await usersManager.createOne({
            ...req.body, 
            password: hashedPassword})
            done(null, createdUser)
    } catch (error) {
        done (error)
    }
}))

passport.use("login", new LocalStrategy({usernameField: "email"}, async(email, password, done)=>{
    if(!email || !password){
        done (null, false)
    }
    try {
        const user = await usersManager.findByEmail(email)
        if (!user){
            done (null, false)
        }
        const passwordValid = await compareData(password, user.password)
        if(!passwordValid){
            done(null, false)
        }
        done(null, user)
    } catch (error) {
        done (error)
    }
}))

passport.use("github", new GithubStrategy({
    clientID: "cbfd5b8c078c38359f3a", 
    clientSecret: "c702fa2f7d455bf21a6c99573d6c59797ee85d3f", 
    callbackURL: "http://localhost:8080/api/sessions/callback"
}, async(accessToke, refreshToke, profile, done)=>{
    try {
        const userDB = await usersManager.findByEmail(profile._json.email)
        if(userDB){
            if(userDB.isGithub){
                return done(null, userDB)
            }else{
                return done (null, false)
            }
        }
        const infoUser = {
            first_name: profile._json.name.split(" ")[0], 
            last_name: profile._json.name.split(" ")[1],
            email: "correo.default@gmail.com", 
            password: " ", 
            isGithub: true
        }
        const createdUser = await usersManager.createOne(infoUser)
        done(null, createdUser)
    } catch (error) {
        done(error)
    }
}))