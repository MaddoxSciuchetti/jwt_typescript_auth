import bcrypt from "bcrypt";
import { CREATED, NO_CONTENT, UNAUTHORIZED } from "../constants/http";
// import { generateAccessToken, generateRefreshToken } from "../utils/Tokens";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants/env";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

export type createAccountParams = {
    username: string,
    password: string,
    userAgent?: string
}

export type Data = {
    token: string
}

export type PostRequest = {
    username: string
}

// temporary storage just for testing

export let refreshTokens: string[] = [

]

const users: createAccountParams[] =  [

]

const posts = [
    {
        username: "Kyle",
        password: "",
        title: "Post1"
    },
    {
        username: "Jim",
        passsword: "",
        title: "Post2"
    },

    {
        username: "maddox",
        title:"this is only for him"
    }
]

export const createAccount = async(data: createAccountParams) => {
    
    
    const hashedpassword = await bcrypt.hash(data.password, 10)
    const user =  {username: data.username, password: hashedpassword}
    users.push(user)
    console.log(users)

    return {
        user,
    }
}

export const loginAccount = async(data: createAccountParams) => {
    const user_raw = users.find(user => user.username == data.username)
    if(user_raw == null){
        throw new Error("the user does not exists")
    } 

     if(await bcrypt.compare(data.password, user_raw.password)){

         const username = data.username
         const user = {name: username}

         const accessToken  = jwt.sign(
             user, ACCESS_TOKEN_SECRET, {expiresIn: "15s"}
         )

         const refreshToken= jwt.sign(
             user, REFRESH_TOKEN_SECRET
         )
         
         refreshTokens.push(refreshToken)
         console.log("these are the refreshtokens ", refreshTokens)
         return {
             accessToken, refreshToken
         };
     } else {
        throw new Error("the passwords do not match")
     }       
}

export const tokenAccount = async (data: Data): Promise<any>=> {
    const refreshToken = data.token
    console.log(refreshToken)
    if(refreshToken == null ) throw new Error("the token is null")
    if(!refreshTokens.includes(refreshToken)) throw new Error("FORBIDDEN")
    return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user: any) => {
    if(err) throw new Error("FORBIDDEN")
        const accessToken = jwt.sign({name: user.name}, ACCESS_TOKEN_SECRET, {expiresIn: "15s"})
        console.log(accessToken)
        return {
            accessToken, 
        }
    })
}

export const deleteRefreshToken = async (data: Data) => {
    refreshTokens = refreshTokens.filter(token => token !== data.token)
    return {
        NO_CONTENT
    }
}

export const getPosts = async(data: PostRequest) => {
    if(posts.filter(post => post.username !== data.username))
        return ({ "message": "you have yet to upload posts"})
    else {
        const post_result = posts.filter(post => post.username === data.username)
        return post_result
    }
}