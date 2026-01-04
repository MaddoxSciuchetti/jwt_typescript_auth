import { Router } from "express";
import { loginHandler, signupHandler, tokenHandler } from "../controller/auth.controller";


const authRoutes = Router()

authRoutes.post("/signup", signupHandler)
authRoutes.post("/login", loginHandler)
authRoutes.post("/token", tokenHandler)


export default authRoutes

