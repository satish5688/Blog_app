
const knex = require("../Config/db_connection")

const post_blog = (req, res) => {
    if (req.userData.length == 0) {
        res.status(400).send({
                "status": "error",
                "message": "this user does not exist in database"
            })
    }else{
        const { title, content } = req.body
        const id = req.userData[0].id

        if (Object.keys(req.body).length == 0) {
            res.status(204).send({ "status": "error", "message": "you can not add empty blog" })
        } else {
            knex("users").where({ id }).then((data) => {
                console.log(data);
                knex("blogs").insert({ title, content, user_id: id }).then((info) => {
                    console.log('Blog added');
                    const name = data[0]['name']
                    const mail = data[0]['email']
                    const user_dict = {
                        'name': name,
                        "email": mail
                    }
                    res.send({
                        "status": "success",
                        "data": {
                            "blog_id": info[0],
                            "title": title,
                            "content": content,
                            "user": user_dict
                        }
                    })
                })
            }).catch((err) => {
                console.log("i am ");
                res.send({
                    "status": "error",
                    "message": err.message
                })
            })

        }}

}



const Get_all_blogs = (req, res) => {
    if (req.userData.length == 0) {
        res.status(400).send({
                "status": "error",
                "message": "this user does not exist in database"
            })
    } else {
        knex("*").from("users").join('blogs', "blogs.user_id", "users.id").then((data) => {
            const all_data = []
            for (s of data) {
                let New_data = {
                    "id": s['id'],
                    "title": s['title'],
                    "content": s["content"],
                    "user_id": s["user_id"],
                    "user": {
                        "name": s['name'],
                        "email": s['email']
                    }
                }
                all_data.push(New_data)
            }
            if (all_data.length == 0) {
                console.log("data is not avaleble");
                res.status(404).send({
                    "status": "error",
                    "message": "blogs are not availeble"
                })
            } else {

                console.log('showing data');
                res.send({
                    "status": "success",
                    "count": all_data.length,
                    "data": all_data
                })
            }
        }).catch((err) => {
            console.log(err);
            res.send(err.message)
        })
    }
}




const Get_blog = (req, res) => {
    const JWT_id = req.userData
    if (JWT_id.length == 0) {
        res.status(400).send({
            "status": "error",
            "message": "this user does not exist in database"
        })
    } else {
        const id = req.params.id
        knex("blogs").where({ id }).then((data) => {
            console.log("you came to check blog");
            if (data.length == 0) {
                res.status(404).send({ 'status': "error", 'message': "this blogs does not exist" })
            } else {
                const user_id = data[0].user_id
                knex('users').where({ id: user_id }).then((info) => {
                    if (info.length == 0) {
                        res.status(403).send({
                                "status": "error",
                                "message": "this user don't have any access"
                            })
                    }
                    const name = info[0]['name']
                    const mail = info[0]['email']
                    const used_dict = {
                        "name": name,
                        "email": mail
                    }
                    data[0]["user"] = used_dict
                    if (data.length !== 0) {
                        console.log("Now you used get blog by id");
                        res.send({
                            "status": "success",
                            "data": data[0]
                        })
                    } else {
                        res.status(404).send({
                            "status": "error",
                            "message": "Invalide Id"
                        })
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
        }).catch((err) => {
            res.send(err)
            console.log(err);
        })
    }
}



const Delete_blog = (req, res) => {
    const id = req.params.id
    if (req.userData.length == 0) {
        res.status(400).send({
            "status": "error",
            "message": "this user does not exist in database"
        })
    } else {
        const UserID = req.userData[0].id
        knex("blogs").where({ id }).then((New_data) => {
            if (New_data.length == 0) {
                res.status(404).send({
                    "status": "error",
                    "message": "this blog does not exist"
                })
            } else {
                const user_id = New_data[0]['user_id']
                if (UserID == user_id) {
                    knex('blogs').where({ id }).del().then((data) => {
                        console.log("blog deleted");
                        if (data == 1) {
                            res.send({
                                "status": "success",
                                "data": New_data
                            })
                        }

                    }).catch((err) => {
                        res.send(err.message)
                    })
                } else {
                    res.status(403).send({
                        "status": "error",
                        "message": "you are not woner of this blog"
                    })
                }
            }
        })
    }
}



const Update_blog = (req, res) => {
    const id = req.params.id
    knex("blogs").where({ id }).then((data) => {
        if (data.length == 0) {
            res.status(400).send({
                "status": "error",
                "message": "this blog does not exist"
            })
        } else if (req.userData.length == 0) {
            res.send({
                "status": "error",
                "message": "this user does not exist in database"
            })
        }
        else {
            const UserID = req.userData[0].id
            const updated_titel = (req.body.title || data[0].title);
            const updated_content = (req.body.content || data[0].content);
            console.log(updated_titel,'\n',updated_content);
            const user_id = data[0]["user_id"];
            knex("users").where({ id: user_id }).then((User_info) => {
                const showing_data = {
                    "blog_id": data[0]["id"],
                    "updated Titel": updated_titel,
                    "updated content": updated_content,
                    'user': {
                        "name": User_info[0]['name'],
                        "email": User_info[0]['email']
                    }
                }
                if (UserID == user_id) {
                    knex("blogs").where({ id }).update({ title: updated_titel, content: updated_content }).then((info) => {
                        res.send({
                            "status": "success",
                            'data': showing_data
                        })
                        console.log('blog updated');
                    }).catch((err) => {
                        res.send(err.message)
                        console.log(err, "second");
                    })
                }
                else {
                    res.status(403).send({
                        "status": "error",
                        "message": "you are not woner of this blog"
                    })
                }
            }).catch((err) => {
                console.log(err);
            })
        }
    }).catch((err) => {
        res.send(err)
        console.log(err, 'first');
    })

}






module.exports = { post_blog, Get_blog, Delete_blog, Update_blog, Get_all_blogs }