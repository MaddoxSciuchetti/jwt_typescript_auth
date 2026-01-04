
import { UNAUTHORIZED, FORBIDDEN, CREATED, NOT_FOUND, NO_CONTENT, INTERNAL_SERVER_ERROR, OK ,} from "./constants/http";
import express from "express";
import cors from "cors";
import "dotenv/config"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import { errorHandler } from "./middleware/errorHandler";
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true}));




app.use(cookieParser())

app.get("/", (req, res, next) => {
    return res.status(OK).json({
        status: "healthy",
    })
})

app.use("/auth", authRoutes)

app.use(errorHandler)




// let refreshTokens = []
// const users = []

// app.post("/signup", async(req, res) => {
//     try {
//         const hashedpassword = await bcrypt.hash(req.body.password, 10)
//         const user = {username: req.body.username, password: hashedpassword}
//         users.push(user)
//         res.status(CREATED).send("you have been signed up")
//     } catch (error) {
//         res.status(NOT_FOUND).send()   
//     }
// })

// app.post("/token", (req, res) => {

//     const refreshToken = req.body.token
//     if(refreshToken == null) return res.sendStatus(UNAUTHORIZED)
//     if(!refreshTokens.includes(refreshToken)) return res.sendStatus(FORBIDDEN)
//     jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
//         if(err) return res.sendStatus(FORBIDDEN)
//         const accessToken = generateAccessToken({name: user.name})
//     res.json({ accessToken: accessToken})
//     })
// })

// app.delete("/logout", (req, res) => {
//     refreshTokens = refreshTokens.filter(token => token !== req.body.token)
//     res.sendStatus(NO_CONTENT)
// })

// app.post("/login", async (req, res) => {
//     const user_raw = users.find(user => user.username == req.body.username)
//     // console.log(user_raw.username)
//     // console.log(req.body.username)
//     if (user_raw == null){
//         return res.status(NOT_FOUND).send("cannot find user")
//     } try {
//         if(await bcrypt.compare(req.body.password, user_raw.password)){
//             const username = req.body.username
            // const user = {name: username}
//             const accessToken = generateAccessToken(user)
            // const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET)
//             refreshTokens.push(refreshToken)
//             res.json({ accessToken: accessToken, refreshToken: refreshToken})
//         } else {
//             res.send("not allowed")
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(INTERNAL_SERVER_ERROR).send("this did not work") 
//     }
// })

// function generateAccessToken(user){
//     return jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: "15s"})
// }

app.listen(3000)