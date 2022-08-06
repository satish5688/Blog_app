const express=require("express")
const router=express.Router()

const {post_blog,Get_blog,Delete_blog,Update_blog,Get_all_blogs } = require("../Controller/blogs")
const { verify_token } = require("../Middleware/auth")


router.post("/blogs",verify_token,post_blog)

router.get("/blogs",verify_token,Get_all_blogs)

router.get("/blogs/:id",verify_token,Get_blog)

router.delete("/blogs/:id",verify_token,Delete_blog)

router.put("/blogs/:id",verify_token,Update_blog)

module.exports = router