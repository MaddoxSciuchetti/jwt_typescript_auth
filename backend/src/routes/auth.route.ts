import { Router } from "express";
import { deleteTokenHandler, loginHandler, signupHandler, tokenHandler } from "../controller/auth.controller";


const authRoutes = Router()

authRoutes.post("/signup", signupHandler)
authRoutes.post("/login", loginHandler)
authRoutes.post("/token", tokenHandler)
authRoutes.post("/delete", deleteTokenHandler)


export default authRoutes

