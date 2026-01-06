import z from "zod";
import bcrypt from "bcrypt";
import {CREATED, FORBIDDEN} from "../constants/http";
import { register } from "node:module";
import catchErrors from "../utils/catchErrors";
import { createAccount, deleteRefreshToken, getPosts, loginAccount, tokenAccount } from "../services/auth.service";
import { setAuthCookies, setTokenCookies } from "../utils/cookies";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constants/env";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";



const registerSchema = z.object({
    username: z.string().min(1).max(55),
    password: z.string().min(6).max(55),
    confirmPassword: z.string().min(6).max(55),
    userAgent: z.string().optional(),
}).refine (
    (data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    }
)

const tokenSchema = z.object({
    token: z.string(),
    userAgent: z.string().optional()
})


const postSchema = z.object({
    username: z.string(),
    userAgent: z.string().optional()
})

export const signupHandler = catchErrors(
    async (req, res) => {

        // validate the request
        const request = registerSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"], 
        })

        // call the register service

        const { user } = await createAccount(request);

        // return the response

        return res.status(CREATED).json(user)

    })

export const loginHandler = catchErrors(
    async(req, res) => {


        // validate the request
        const request = registerSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"],
        })

        // call the service

        const {accessToken, refreshToken} = await loginAccount(request);

        // return response
        return setAuthCookies({ res, accessToken, refreshToken})
        .status(CREATED).json("sucess")


    }
)

export const tokenHandler = catchErrors(
    async (req, res) => {

        // validate the request
        const request = tokenSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"]
        })

        // call the service

        const {accessToken} = await tokenAccount(request);

        // return response

        return setTokenCookies({res, accessToken})
        .status(CREATED).json("sucess")
       
    }
)

export const deleteTokenHandler = catchErrors(
    async (req, res) => {

        // validate the request

        const request = tokenSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"]
        })

        // call the service

        const value = await deleteRefreshToken(request)

        // return response

        return res.status(CREATED).send("the refresh token was deleted")

    }
)
export interface RequestCustomer extends Request{
    user: string | JwtPayload | undefined
}




export const authentificationToken = function(req: RequestCustomer,  res: Response, next: NextFunction) {

    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if(token == null) throw new Error("unauthrized")

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) throw new Error("status forbiden")
            req.user = user
        next()
        return ;
    })
}


export const handleposts = catchErrors(
    async(req, res) => {
        // validate the request
        
        const request = postSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"]
        })
        
        // call the service
        
        const posts = await getPosts(request) 
        
        
        // return the response
        
        return res.status(CREATED).json(posts)
        
    }
)


