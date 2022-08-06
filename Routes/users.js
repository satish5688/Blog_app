const express = require("express")
const router = express.Router()


const { add_users, log_in} = require("../Controller/users.js")


router.post('/signup', add_users)

router.post("/login",log_in )

// router.post("/blogs",verify_token, post_blog)

module.exports = router