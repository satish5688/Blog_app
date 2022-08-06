const { generate_token } = require("../Middleware/auth")
const knex = require("../Config/db_connection")



const add_users = async (req, res) => {
    const { name, email, password } = req.body
    const body = req.body
    const mail = req.body.email
    data = await knex("users").where({ email: mail })
    if (Object.keys(req.body).length==0) {
        res.status(204).send({
            "status": "error",
            "message": "you can not data empty data"
        })
        console.log("this user already exist");
    } else if (data.length !== 0) {
        res.send({
            "status": "error",
            "message": "this user already exist"
        })
    } else {
        knex("users").insert({ name, email, password }).then(() => {
            console.log("user added into the databaes");
            res.status(201).send({
                "status": "success",
                "data": { "name": name, "email": email, "password": password }
            })
        })
    }
}


const log_in = (req, res) => {
    const { email, password } = req.body
    knex("users").where({ email, password }).then((user) => {
        if (user.length !== 0) {
            const token = generate_token(user[0].id)
            res.cookie("token", token)
            console.log("user longed in..");
            return res.send({
                "status": "success",
                "message": user
            })
        } else {
        
            res.status(400).send({
                "status": "error",
                "message": "incorrect email or password"
            })
        }
    }).catch((err) => {
        res.send(err)
    })

}




module.exports = { add_users, log_in }