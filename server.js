const express = require('express')
const app = express()

require('dotenv').config()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Im working')
})

app.use('/', require('./Routes/users'))

app.use("/", require("./Routes/blogs"))

app.use('/', require("./Routes/likes"))

const port = process.env.PORT || 8010

app.listen(port, () => {
    console.log((`Your server is running on: http://localhost:${port}`));
})