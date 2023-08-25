const express = require('express')
const courseRouter = express.Router()
const Course = require('../models/Course')


courseRouter.route('/')
    .get(async (req, res) => {
        const courses = await Course.find()

        res.json(courses)
    })
    .post((req, res) => {
        const course = new Course({
            courseName: req.body.courseName
        })

        course.save()

        res.json(course)
    })

// Get or Delete a specific course
courseRouter.route('/:id')
    .get(async (req, res) => {
        const course = await Course.findOne({ _id: req.params.id })

        res.json(course)
    })
    
    .delete(async (req, res) => {
        const result = await Course.findByIdAndDelete({ _id: req.params.id })

        res.json(result)
    })

module.exports = courseRouter