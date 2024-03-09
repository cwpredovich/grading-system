import { useState, useEffect } from "react"

const API_BASE = "http://127.0.0.1:3001"

function Students2() {
    const [students, setStudents] = useState([])
    const [isNewStudentFormShowing, setIsNewStudentFormShowing] = useState(false)

    // fetch this from  the db using GetCourses and useEffect()
    const [courseCatalog, setCourseCatalog] = useState([])

    // state variables for the add new student form
    const [studentName, setStudentName] = useState('')
    const [email, setEmail] = useState('')
    const [studentId, setStudentId] = useState('')
    const [newCourses, setNewCourses] = useState([])
    
    useEffect(() => {
        GetStudents()
        GetCourses()
    }, [])

    const GetStudents = () => {
        fetch(API_BASE + "/students/")
            .then(res => res.json())
            .then(data => setStudents(data))
            .catch(err => console.log("Error: ", err))
    }

    const GetCourses = () => {
        fetch(API_BASE + "/courses/")
            .then(res => res.json())
            .then(data => setCourseCatalog(data))
            .catch(err => console.log("Error: ", err))
    }

    const DeleteStudent = (studentDbId) => {
        const deleteUrl = `${API_BASE}/students/${studentDbId}`
        fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            alert("Student removed from the database.")
            window.location.reload()
        })
    }

    const convertGradeToGradePoints = (grade) => {
        const gradeConversionArray = ['f', 'd', 'c', 'b', 'a']
        let conversion = gradeConversionArray.indexOf(grade.toLowerCase())
        return conversion
    }

    // TODO:  Need to make sure that user can't add a student to a class more than once
    
    const addNewCourses = (e) => {
        e.preventDefault()
        setNewCourses([
            ...newCourses, 
            {
                courseId: newCourses.length,
                courseName: '',
                gradeId: newCourses.length + 1,
                grade: ''
            }
        ])
    }
    
    // TODO:  Need to make a way to remove new classes before submitting
    // const removeNewCourses = () => {

    // }

    // this function was implemented on the backend and worked fine there until i connected the frontend
    // now the app is working, except that the gpa calculation seems to be wrong
    // everyone with only one class gets a 4 gpa
    // UPDATE:  bug was fixed some time ago. I tested it today, and gpa calc works fine now.
    // not sure what I did to fix it.
    const calculateGpa = (courseList) => {
        const numOfCourses = courseList.length
        let totalGradePoints = 0
        courseList.forEach(course => totalGradePoints += Number(course.grade))
        let gpa = (totalGradePoints / numOfCourses).toFixed(1)
        return gpa
    }

    // a function that clears all the fields in the
    // add new student form
    // and sets toggles the isNewStudentFormShowing state variable
    // to the off (false) position
    const cancelAddStudent = () => {
        setStudentName('')
        setEmail('')
        setStudentId('')
        setNewCourses([])
        setIsNewStudentFormShowing(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(newCourses)
        // if the first object in the newCourses array has a value for the key courseName
        if (newCourses[0] && newCourses[0].courseName) {
            let newCoursesConvertedGrades = newCourses.map(course => 
                course.grade = convertGradeToGradePoints(course.grade))
            
            newCoursesConvertedGrades.forEach(course => {
                delete course.courseId
                delete course.gradeId
            })
    
            setNewCourses(newCoursesConvertedGrades)
    
            const postUrl = API_BASE + "/students"
            fetch(postUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: studentName,
                    email: email,
                    id: studentId,
                    gpa: calculateGpa(newCourses),
                    courses: newCourses
                })
            })
            .then(()=>{
                alert('New student has been added to the system!')
                window.location.reload()
            })
        } else {
            e.preventDefault()
            alert('Please add at least 1 course for the new student!')
        }
    }

    const StudentList = () => {
        return(
            <div>
                <div className="row page-header">
                    <div className="col-6 grid-item col-header">Name</div>
                    <div className="col-3 grid-item col-header">Course Qty.</div>
                    <div className="col-3 grid-item col-header">Cum. GPA</div>
                </div>

                <div className="spacer">
                </div>
                
                {
                    students.map(student => (
                        <div className="row page-item" key={student._id}>
                            <div className="col-6 grid-item">
                                {student.name}
                                <button className="remove-student-btn" onClick={() => DeleteStudent(student._id)}>Remove</button>
                            </div>
                            <div className="col-3 grid-item">
                                {student.courses.length}    
                            </div>
                            <div className="col-3 grid-item">
                                {student.gpa.toFixed(1)}
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }
    
    return(
        <div>
            <StudentList />
            {isNewStudentFormShowing ? 
                <div>
                    <h4>Add New Student</h4>
                    <form className='add-form' onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name">Name: </label>
                            <input
                                required 
                                type='text'
                                name='name'
                                id='name'
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="email">Email: </label>
                            <input 
                                required
                                type='email'
                                name='email'
                                id='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor='id'>ID: </label>
                            <input 
                                required
                                type='text'
                                name='id'
                                id='studentId'
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                            ></input>
                        </div>

                        

                        {newCourses.map((course, index) => (
                            <div key={course.courseId}>
                                <div>
                                    <label htmlFor={`course-${course.courseId}`}>Course {course.courseId + 1}: </label>
                                    <select 
                                        required 
                                        onChange={(e) => {
                                            const updatedCourses = [...newCourses]
                                            updatedCourses[index].courseName = e.target.value
                                            setNewCourses(updatedCourses)
                                            console.log(newCourses)
                                        }}>
                                        <option value="none">---Select a course---</option>

                                        {courseCatalog.map((course) => (
                                            <option value={course.courseName}>{course.courseName}</option>
                                        ))}
                                    </select>
                                    
                                </div>
                                <div>
                                    <label htmlFor={`grade-${course.gradeId}`}>Current Grade for Course {course.gradeId}: </label>
                                    <input
                                        required
                                        type='text'
                                        placeholder='Letter grade, ie. A, B, C, or etc.'
                                        id={`grade-${course.gradeId}`}
                                        value={course.grade}
                                        onChange={(e) => {
                                            const updatedCourses = [...newCourses]
                                            updatedCourses[index].grade = e.target.value
                                            setNewCourses(updatedCourses)
                                        }}
                                    >
                                    </input>
                                </div>
                            </div>
                        ))}

                        <button onClick={addNewCourses}>{
                            newCourses.length > 0 ?
                                <span>+ Add additional course</span>
                            :
                                <span>+ Add at Least 1 Course for Student</span>
                            }
                        </button>

                        <div>
                            <button type='submit'>Submit</button>
                        </div>
                    </form>
                </div>
                :
                null
            }
            {/* <Header /> */}

            <div>
                {isNewStudentFormShowing ? 
                    <button onClick={() => cancelAddStudent()}>Cancel</button>
                :
                    <button onClick={() => setIsNewStudentFormShowing(!isNewStudentFormShowing)}>Add New Student</button>
                }
                
            </div>

        </div>
    )
}

export default Students2