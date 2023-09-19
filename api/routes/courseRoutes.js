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
courseRouter.route('/:course')
    .get(async (req, res) => {
        const courses = await Course.find()
        const course = courses.find(el => el.courseName.toLowerCase().replace(/ /g, '-') === req.params.course)

        res.json(course)
    })
    
    // TODO:  need to standardize this with the other request methods
    .delete(async (req, res) => {
        const result = await Course.findByIdAndDelete({ _id: req.params.id })

        res.json(result)
    })

module.exports = courseRouter