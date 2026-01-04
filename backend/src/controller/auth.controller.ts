import z from "zod";
import bcrypt from "bcrypt";
import {CREATED, FORBIDDEN} from "../constants/http";
import { register } from "node:module";
import catchErrors from "../utils/catchErrors";
import { createAccount, deleteRefreshToken, loginAccount, tokenAccount } from "../services/auth.service";
import { setAuthCookies, setTokenCookies } from "../utils/cookies";


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