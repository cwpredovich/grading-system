const express = require('express')
const studentRouter = express.Router()
const Student = require('../models/Student')

//// POLYA'S PROCESS ////
// 1.  Understand the problem
    // I need a function that calculates and stores each student's gpa
    // so, I need to add up their grade points from each class
    // sum the number of classes
    // divide the total grade points by the number of classes
    // round the result to the nearest tenth ex. 3.7 or 3.2, not 3.718 or 3.196 respectively
// 2.  Make a plan (pseudocode)
    // I want to write a function outside of my .post() method that calculates the gpa
    // and then I want to call that gpa calc func inside the .post()
    const calculateGpa = (courseList) => {
        // get the number of classes
        const numOfCourses = courseList.length
        // initialize a variable to store the gradePoints
        let totalGradePoints = 0
        // next, get the totalGradePoints for each course and add them up in the gradePoints variable
        courseList.forEach(course => totalGradePoints += course.grade)
        // calculate gpa by dividing totalGradePoints by numOfCourses
        let gpa = totalGradePoints / numOfCourses
        // return gpa rounded to the nearest tenth, aka to the nearest decimal point
        return gpa.toFixed(1)
        }
// 3.  Execute the plan
// 4.  Review:
    // Did it work? Does it work consistently?
        // no, had to fix minor bugs
        // test cases:
            // after changing a student's grade with the PUT request
            // when there is only one course
            // gpa's below zero
            // rounding
    // Was/Is there a better way?
            // Yes. It is working a lot better now that it's implemented on the frontend.

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
            courses: req.body.courses,
            gpa: req.body.gpa
            // needed to say this.courses, not just courses
            // gpa: calculateGpa(this.courses)
        })

        student.save()
        res.json(student)
    })

// dumb bug, had to add a / in front of :id
studentRouter.route('/:student') 
    // Question:  Does this need to be asynchronous? I think so, but I want to try it without async/await
    .get(async (req, res) => {
        const student = await Student.findOne({ _id: req.params.student })   // syntax is critical here. must have ({ _id: req.params.id }), not just (req.params.id)

        res.json(student)
    })
    
    .delete(async (req, res) => {
        const result = await Student.findByIdAndDelete({ _id: req.params.student })

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

// ...AND NOW THE PUT REQUEST BELOW WORKS WELL TOO!
    .put(async (req, res) => {
        try {
            let student = await Student.findOne({ _id: req.params.student })
            if (!student) {
                return res.status(404).json({ error: "Student not found" })
            } else {
                // bug:  had to use array.findIndex() method rather than array.indexOf()
                // let courseIndex = await student.courses.findIndex(el => el.courseName.toLowerCase().replace(/ /g, '-') === req.params.course)
                // commented out the above line and removed the await, keeping it here in case it doesn't work
                // without the await
                let courseIndex = student.courses.findIndex(el => el.courseName.toLowerCase().replace(/ /g, '-') === req.params.course)
                
                student.courses[courseIndex].grade = req.body.grade

                // student.gpa = await calculateGpa(student.courses)
                student.gpa = calculateGpa(student.courses)

                student.save()

                return res.status(200).json(student)
            }
        }
        
        catch (error) {
            console.error(error)
            res.status(500).json({ error:  "Internal server error: unable to update grade."})
        }
    })

// another dumb, small bug
module.exports = studentRouter