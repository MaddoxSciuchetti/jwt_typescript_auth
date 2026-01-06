import { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { FORBIDDEN, UNAUTHORIZED } from "../constants/http"
import { ACCESS_TOKEN_SECRET } from "../constants/env"
import jwt from "jsonwebtoken";


export interface RequestCustomer extends Request{
    user: string | JwtPayload | undefined
}


export const authentificationToken = function(req: RequestCustomer,  res: Response, next: NextFunction){

    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if(token == null) 
        res.status(UNAUTHORIZED).send("this is allowed")
    else {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) res.status(FORBIDDEN).send("status forbiden")
            req.user = user
            next()
        })
    }
}