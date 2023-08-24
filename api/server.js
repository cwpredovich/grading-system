const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
// dumb, small bug. needed to wrap the string below in a require()
const studentRoutes = require('./routes/studentRoutes')
const courseRoutes = require('./routes/courseRoutes')

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/mern-grading-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to the database'))
    .catch(console.error)


app.use('/students', studentRoutes)
app.use('/courses', courseRoutes)

app.listen(3001, () => console.log('Server started on port 3001'))
