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
        try {
            const student = await Student.findOne({ _id: req.params.student })
            if (!student) {
                return res.status(404).json({ error: "Student not found" })
            }

            const courses = await student.courses
            if (!courses) {
                return res.status(404).json({ error: "Courses not found for this student"})
            }

            // SAVE!! These 6 lines work well!!
            const course = await courses.find(el => el.courseName.toLowerCase().replace(/ /g, '-') === req.params.course)
            if (!course) {
                return res.status(404).json({ error: "This course was not found for this student"})
            } else {
                return res.json(course)
            }
        }

        catch (error) {
            console.error(error)
            res.status(500).json({ error:  "Internal server error"})
        }
    })

// EXPERIMENTAL ROUTE //

// THE GET REQUEST BELOW WORKS!
studentRouter.route('/:student/:course/grade')
    .get(async (req, res) => {
    const student = await Student.findOne({ _id: req.params.student })
    const course = await student.courses.find(
        course => 
            course.courseName.toLowerCase().replace(/ /g, '-') === req.params.course
        )
    let grade = await course.grade

    res.json(grade)
    })

// TESTING THE PUT REQUEST NOW...
// Ok, so it seemed to work fine when I sent the put request
// but I did a GET request right after finishing the PUT request,
// and the grade did not change in the db
    .put(async (req, res) => {
        try {
            let student = await Student.findOne({ _id: req.params.student })
            if (!student) {
                return res.status(404).json({ error: "Student not found" })
            } else {
                // bug:  had to use array.findIndex() method rather than array.indexOf()
                let courseIndex = await student.courses.findIndex(el => el.courseName.toLowerCase().replace(/ /g, '-') === req.params.course)
                student.courses[courseIndex].grade = req.body.grade
                student.save()

                return res.status(200).json(student)
            }

            // let courseIndex = await student.courses.indexOf(el => el.courseName.toLowerCase().replace(/ /g, '-') === req.params.course)
            // if () {
            //     return res.status(404).json(
            //         {
            //             error: "Course not found for student",
            //             course: req.params.course,
            //             student: student
            //         }
            //         )
            // }

            // let hardCodedCourseIndex = 3
            // if (hardCodedCourseIndex < 0) {
            //     return res.status(404).json(
            //         {
            //             error: "Course not found for student"
            //         }
            //         )
            // } else {
            //     return res.status(200).json(
            //         {
            //             course: student.courses[hardCodedCourseIndex]
            //         }
            //     )
            // }

            
            // student.save()

            // res.json(student.courses)
        }
        
        catch (error) {
            console.error(error)
            res.status(500).json({ error:  "Internal server error"})
        }
    })

// another dumb, small bug
module.exports = studentRouter