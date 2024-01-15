import { useState, useEffect } from "react"

const API_BASE = "http://127.0.0.1:3001"

function Students2() {
    const [students, setStudents] = useState([])
    const [isNewStudentFormShowing, setIsNewStudentFormShowing] = useState(false)

    const [courseCatalog, setCourseCatalog] = useState([])

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

    // TODO:  Consider making a function that formats the gpa's so that they all include one decimal place, even if it's a whole number
    // const formatGPA = (studentGpaFromDb) => {  
    // }

    const convertGradeToGradePoints = (grade) => {
        const gradeConversionArray = ['f', 'd', 'c', 'b', 'a']
        let conversion = gradeConversionArray.indexOf(grade.toLowerCase())
        return conversion
    }

    const addNewCourses = (e) => {
        e.preventDefault()
        setNewCourses([...newCourses, {courseId: newCourses.length, courseName: '', gradeId: newCourses.length + 1, grade: ''}])
    }

    // this function was implemented on the backend and worked fine there until i connected the frontend
    // now the app is working, except that the gpa calculation seems to be wrong
    // everyone with only one class gets a 4 gpa
    const calculateGpa = (courseList) => {
        const numOfCourses = courseList.length
        let totalGradePoints = 0
        courseList.forEach(course => totalGradePoints += Number(course.grade))
        let gpa = (totalGradePoints / numOfCourses).toFixed(1)
        return gpa
    }

    const handleSubmit = (e) => {
        if (newCourses[0].courseName) {
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
                alert('New student has been added to the system!');
            })
        } else {
            e.preventDefault()
            alert('Please add at least 1 course for the new student!')
        }
    }

    const Header = () => {
        return(
            <div>
                <button 
                    onClick={() => {
                        setIsNewStudentFormShowing(!isNewStudentFormShowing)
                        }}>
                    {!isNewStudentFormShowing ? <span>Add Student </span> : <span>Cancel</span>}
                </button>
            </div>
        )
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
                            </div>
                            <div className="col-3 grid-item">
                                Course Qty.    
                            </div>
                            <div className="col-3 grid-item">
                                {student.gpa}
                            </div>
                            {/* <div>
                                <button onClick={() => DeleteStudent(student._id)}>Remove</button>
                            </div> */}
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

                    <button onClick={addNewCourses}>+ Add at Least 1 Course for Student</button>
                    {newCourses.map((course, index) => (
                        <div key={course.courseId}>
                            <div>
                                <label htmlFor={`course-${course.courseId}`}>Course {course.courseId + 1}: </label>
                                <select onChange={(e) => {
                                    const updatedCourses = [...newCourses]
                                    updatedCourses[index].courseName = e.target.value
                                    setNewCourses(updatedCourses)
                                }}>
                                    <option value="Select a course">---Select a course---</option>

                                    {courseCatalog.map((course) => (
                                        <option value={course.courseName}>{course.courseName}</option>
                                    ))}
                                </select>
                                
                            </div>
                            <div>
                                <label htmlFor={`grade-${course.gradeId}`}>Current Grade for Course {course.gradeId}: </label>
                                <input
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

                    <div>
                        <button type='submit'>Submit</button>
                    </div>
                </form>
                :
                null
            }
            <Header />
        </div>
    )
}

export default Students2