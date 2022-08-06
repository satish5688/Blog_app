
const knex = require("../Config/db_connection")



const like = (req, res) => {
    const user_id = req.userData[0].id
    const blog_id = req.body.blog_id
    const like = req.body.like

    if (Object.keys(req.body).length == 0) {
        res.send({
            'status': "error",
            'message': "you can not do any action with empty body.."
        })
    } else {
        knex("blogs").where({ id: blog_id }).then((data) => {

            if (data.length !== 0) {
                const user = data[0]['user_id']
                knex("users").where({ id: user }).then((user_data) => {
                    knex('likes').where({ user_id, blog_id }).then((liked) => {
                        if (liked.length !== 0) {
                            knex('likes').where({ user_id, blog_id }).update({ like }).then((upadated) => {
                                res.send({
                                    "like": like,
                                    "blog": {
                                        'title': data[0]['title'],
                                        'content': data[0]['content'],
                                        "user_id": data[0]['user_id']
                                    },
                                    "blog_id": blog_id,
                                    "user": {
                                        'name': user_data[0]['name'],
                                        "email": user_data[0]['email']
                                    }
                                })
                                console.log("like updated");
                            })
                        } else {
                            knex('likes').insert({ user_id, blog_id, like }).then((sent) => {
                                res.send({
                                    "like": like,
                                    "blog": {
                                        'title': data[0]['title'],
                                        'content': data[0]['content'],
                                        "user_id": data[0]['user_id']
                                    },
                                    "blog_id": blog_id,
                                    "user": {
                                        'name': user_data[0]['name'],
                                        "email": user_data[0]['email']
                                    }
                                })
                            })
                            console.log("like added");
                        }
                    })
                })
            } else {
                res.send({ "status": "error", 'message': "this blog does not exist." })
            }

        })
    }
}





const see_likes = (req, res) => {

    const blog_id = req.params.id
    knex("blogs").where({ id: blog_id }).then((blog_data) => {
        if (blog_data.length == 0) {
            res.send({ "status": "error", 'message': "this blog does not exist." })
        } else {
            knex("likes").where({ blog_id: blog_id, like: 1 }).then((like_data) => {
                knex("*").from('users').then((user_data) => {
                    var data_collection = []
                    const like = like_data.map((ele) => {
                        user_material = user_data.filter((element) => {
                            dict = {}
                            if (ele['user_id'] == element['id']) {
                                dict['name'] = element['name']
                                dict['email'] = element['email']
                                data_collection.push(dict)

                            }
                        })
                    })

                    const likes = []
                    for (s in like_data) {
                        diction = {}
                        diction['like'] = like_data[s]['like']
                        diction['user_id'] = like_data[s]['user_id']
                        diction['user'] = data_collection[s]
                        likes.push(diction)
                    }

                    res.send({
                        "title": blog_data[0]['title'],
                        "content": blog_data[0]['content'],
                        "blog_id": blog_data[0]['id'],
                        'count': like_data.length,
                        "likes": likes
                    })


                })

            })

        }

    })
}




module.exports = { like, see_likes }