require("dotenv").config()
const conf = {
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,

}

// console.log(conf);
const client = {
    client: process.env.CLIENT,
    connection: conf
}


const knex = require("knex")(client)




knex.schema.hasTable("users").then(exists => {
    if (!exists) {
        return knex.shema.createTable("users", table => {
            table.increments('id').primary()
            table.string("name")
            table.string("mail")
            table.string('password')

        }).then((r) => {
            console.log("usres table created successfully");
        }).catch((err) => {
            console.log(err);
        })
    }
})






knex.schema.hasTable("blogs").then((exists) => {
    if (!(exists)) {
        return knex.schema.createTable("blogs", (table) => {
            table.increments('id').primary()
            table.integer("user_id").unsigned().nullable()
            table.string("title")
            table.text("content")
            table.timestamp("created_at").defaultTo(knex.fn.now())
            table.foreign("user_id").references("users.id")
        }).then((result) => {
            console.log("blog table created");
        }
        ).catch((err) => {
            console.log(err);
        })

    }
})



knex.schema.hasTable("likes").then((exists) => {
    if (!(exists)) {
        return knex.schema.createTable("likes", (table) => {
            table.increments('id').primary()
            table.integer("user_id").unsigned().nullable()
            table.integer("blog_id").unsigned().nullable()
            table.boolean("like").nullable()
            table.foreign("user_id").references("users.id")
            table.foreign("blog_id").references("blogs.id")
        }).then((result) => {
            console.log("likes table created");
        }
        ).catch((err) => {
            console.log(err);
        })

    }
})






module.exports = knex