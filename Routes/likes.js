const express = require("express")
const router = express.Router()
const { verify_token } = require("../Middleware/auth")
const  {like,see_likes} = require("../Controller/likes")

router.post("/likes",verify_token, like)

router.get('/likes/:id',verify_token,see_likes)






module.exports = router