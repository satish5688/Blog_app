const jwt = require("jsonwebtoken")
const knex = require('../Config/db_connection')

const generate_token = (id => {
    console.log('token generated');
    return jwt.sign(id, "kuchbhi")
})


const verify_token = async (req, res, next) => {

    if (req.headers.cookie) {
        const token = req.headers.cookie.split("=")[1]
        const id = jwt.verify(token, "kuchbhi")
        const user = await knex('users').where({ id })
        req.userData = user
        next()
    } else {
        res.status(401).send({
            "status": "error", 
            "message": "Authantication failed."
        })
    }
}





module.exports = { generate_token, verify_token }