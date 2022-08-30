
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




const see_all_blog_like = (req, res) => {
    knex("*").from("users").join('blogs', "blogs.user_id", "users.id").then(async(data) => {
        const all_data = []
        for (s of data) {
            const id=s["id"]
            const like=await knex('likes').where({blog_id:id,like:1})
            const like_data=like
            let New_data = {
                "id": s['id'],
                "title": s['title'],
                "content": s["content"],
                "user_id": s["user_id"],
                "posted user": {
                    "name": s['name'],
                    "email": s['email']
                },
                'lieks':like_data,
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
module.exports = { like, see_likes, see_all_blog_like }