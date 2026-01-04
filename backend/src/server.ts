import express from "express";
import "dotenv/config";
import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_SECRET } from "./constants/env";
const app = express()

app.use(express.json())


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


app.get("/posts", authentificationToken, (req, res) => {
    if(posts.filter(post => post.username !== req.username))
        res.json({ "message": "you have yet to upload posts"})
    else {
        res.json(posts.filter(post => post.username === req.user.name))
    }
})

function authentificationToken(req, res, next) {

    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if(token == null) return res.status(401).send({error: "unauthorized"})

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).send({ error: "forbidden"})
        req.user = user
        next()
    })
}


app.listen(3000)