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

// Bug:  These routes / requests aren't working
studentRouter.route('/:id') // dumb bug, had to add a / in front of :id
    // Question:  Does this need to be asynchronous? I think so, but I want to try it without async/await
    .get(async (req, res) => {
        const student = await Student.findOne({ _id: req.params.id })   // syntax is critical here. must have ({ _id: req.params.id }), not just (req.params.id)

        res.json(student)
    })
    
    .delete(async (req, res) => {
        const result = await Student.findByIdAndDelete({ _id: req.params.id })

        res.json(result)
    })

// another dumb, small bug
module.exports = studentRouter