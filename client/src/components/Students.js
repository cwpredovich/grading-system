import { useState, useEffect } from "react"

const API_BASE = "http://127.0.0.1:3001"


function Students() {
    const [students, setStudents] = useState([])
    const [isNewStudentFormShowing, setIsNewStudentFormShowing] = useState(false)
    
    const [studentName, setStudentName] = useState('')
    const [email, setEmail] = useState('')
    const [studentId, setStudentId] = useState('')

    const [newCourses, setNewCourses] = useState([])
    
    useEffect(() => {
        GetStudents()
    }, [])

    const GetStudents = () => {
        fetch(API_BASE + "/students")
            .then(res => res.json())
            .then(data => setStudents(data))
            .catch(err => console.log("Error: ", err))
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
        setNewCourses([...newCourses, {courseId: newCourses.length, courseName: '', gradeId: newCourses.length + 1, grade: ''}])
        e.preventDefault()
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
    }

    const Header = () => {
        return(
            <div>
                <h3>All Students:</h3>
                <button 
                    onClick={() => {
                        setIsNewStudentFormShowing(!isNewStudentFormShowing)
                        }}>
                    {!isNewStudentFormShowing ? <span>+ </span> : <span>- </span>} Add Student
                </button>
            </div>
        )
    }

    

    const StudentList = () => {
        return(
            <ol>
                {
                    students.map(student => (
                        <li className='student' key={student._id}><button>{student.name}, {student.gpa} GPA</button></li>
                        
                    ))
                }
            </ol>
        )
    }

    return(
        <div>
            <Header />
            {isNewStudentFormShowing ? 
                <form className='add-form' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Name: </label>
                        <input 
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
                            type='text'
                            name='id'
                            id='studentId'
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                        ></input>
                    </div>

                    

                    <button onClick={addNewCourses}>+ Add Course for Student</button>
                    {newCourses.map((course, index) => (
                        <div key={course.courseId}>
                            <div>
                                <label htmlFor={`course-${course.courseId}`}>Course {course.courseId + 1}: </label>
                                <input
                                    type='text'
                                    id={`course-${course.courseId}`}
                                    value={course.courseName}
                                    onChange={(e) => {
                                        const updatedCourses = [...newCourses]
                                        updatedCourses[index].courseName = e.target.value
                                        setNewCourses(updatedCourses)
                                    }}
                                >
                                </input>
                            </div>
                            <div>
                                <label htmlFor={`grade-${course.gradeId}`}>Current Grade for Course {course.gradeId}: </label>
                                <input
                                    type='text'
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
            <StudentList />
        </div>
    )
}

export default Students