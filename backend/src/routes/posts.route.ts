import { Router } from "express";
import { handleposts } from "../controller/auth.controller";
import { authentificationToken } from "../utils/authenficatingToken";



const postsRoutes = Router()



postsRoutes.get("/login", authentificationToken as any, handleposts)


export default postsRoutes;