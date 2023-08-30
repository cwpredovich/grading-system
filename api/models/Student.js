const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    gpa: {
        type: Number,
        required: true
    },
    courses: [
        {
            courseName: {
                type: String,
                required: true
            },
            grade: {
                type: Number,
                required: true
            }
        }
        
    ]
})

const Student = mongoose.model('Student', StudentSchema)

module.exports = Student
