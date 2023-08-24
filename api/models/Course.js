const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CourseSchema = new Schema({
    courseName: {
        type: String,
        required: true
    }
    // ,
    // enrolledStudents: [
    //     {
    //         studentName: {
    //             type: String,
    //             required: true
    //         },
    //         studentId: {
    //             type: Number,
    //             required: true
    //         },
    //         grade: {
    //             type: Number,
    //             required: true
    //         }
    //     }
    // ]
})

const Course = mongoose.model('Course', CourseSchema)

module.exports = Course