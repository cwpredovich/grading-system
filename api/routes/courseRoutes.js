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
            courseName: req.body.courseName,
            enrolledStudents: req.body.enrolledStudents
            // this will be an array of objects.
            // each object will have a student name,
            // student id,
            // and a student grade
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

    // Routes for specific class AND student
    courseRouter.route('/:id/:student')
    // GET the grade for a specific student in a specific class
    .get(async (req, res) => {
        const course = await Course.findOne({ _id: req.params.id })
        const student = await course['enrolledStudents'].find(student => student['_id'].toString() === req.params.student)
        
        res.json(student)
    })
    
    // Edit the grade for a specific class, for a specific student
    // .put(async (req, res) => {
        // res.send('hello world and put function')
        // const course = await Course.findOne({ _id: req.params.id })
        // const student = await course['enrolledStudents'].find(student => student['_id'].toString() === req.params.student)
        
        // const grade = await Course.findOneAndUpdate( {_id: req.params.id }, {
        //     $set: {
        //         enrolledStudents: {
        //             $set: {
        //                 [req.params.student]: {
        //                     grade: req.body.grade
        //                 }
        //             }
        //         }
        //     }
        // })




        // const students = await course['enrolledStudents']
        // let grade = await students.find(student => student['_id'].toString() === req.params.student)['grade']
        // await grade = req.body.grade
        // const grade = await students.findOneAndUpdate({ _id: req.params.student }, { grade: req.body.grade })
        
        // everything before this works!
        // grade.save()
        // grade.save()

        // res.json(grade)


        // if (course) {
        //     // dumb bug:  had to add a .toString() after student['_id']
        //     const grade = course['enrolledStudents'].find(student => student['_id'].toString() === req.params.student)['grade']

        //     res.json(grade)
        // } else {
        //     res.status(404)
        // }

        // res.json(grade)

    // })

module.exports = courseRouter