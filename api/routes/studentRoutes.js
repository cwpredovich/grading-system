const express = require('express')
const studentRouter = express.Router()
const Student = require('../models/Student')


studentRouter.route('/')
    .get(async (req, res) => {
        const students = await Student.find()

        res.json(students)
    })
    .post((req, res) => {
        const student = new Student({
            name: req.body.name,
            email: req.body.email,
            id: req.body.id,
            courses: req.body.courses
        })

        student.save()

        res.json(student)
    })

// dumb bug, had to add a / in front of :id
studentRouter.route('/:id') 
    // Question:  Does this need to be asynchronous? I think so, but I want to try it without async/await
    .get(async (req, res) => {
        const student = await Student.findOne({ _id: req.params.id })   // syntax is critical here. must have ({ _id: req.params.id }), not just (req.params.id)

        res.json(student)
    })
    
    .delete(async (req, res) => {
        const result = await Student.findByIdAndDelete({ _id: req.params.id })

        res.json(result)
    })

studentRouter.route('/:student/:course')
    // GET a student's grade given the course name
    // endpoint URI will have the student's db _id/courseName
    .get(async (req, res) => {
        // the student variable in the URI must be the _id automatically assigned by Mongo/Mongoose
        const student = await Student.findOne({ _id: req.params.student })
        const grade = await student['courses'].find(course => course['courseName'].toLowerCase() === req.params.course.toLowerCase()).grade

        res.json(grade)
    })

// another dumb, small bug
module.exports = studentRouter