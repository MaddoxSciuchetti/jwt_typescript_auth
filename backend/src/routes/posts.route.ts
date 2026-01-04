import { Router } from "express";
import { handleposts } from "../controller/auth.controller";

const postsRoutes = Router()



postsRoutes.post("/login", handleposts )


export default postsRoutes;