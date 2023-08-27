const mongoose = require('mongoose')
const Schema = mongoose.Schema

// data that is accessed together stays together
const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
        // TODO: add client-side data validation for the email address
    },
    id: {
        type: String,
        required: true
        // TODO: perhaps add client-side validation for this too
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
