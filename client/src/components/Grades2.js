import { useState, useEffect } from "react"
import '../AppReimagined.css'

const API_BASE = "http://127.0.0.1:3001"

const Grades2 = () => {

    const [students, setStudents] = useState([])
    const [studentToFind, setStudentToFind] = useState('')
    const [coursesForStudent, setCoursesForStudent] = useState([])
    // const [courseToFind, setCourseToFind] = useState({})

    const [currentGrade, setCurrentGrade] = useState('')
    
    const GetStudents = () => {
        fetch(`${API_BASE}/students`)
            .then(res => res.json())
            .then(data => {
                setStudents(data)
                // console.log("Grades.js line 19. students:", students)
            })
            .catch(err => console.log("Error: ", err))
    }
    
    useEffect(() => {
        GetStudents()
        const fetchCoursesForStudent = async () => {
            const response = await fetch(`${API_BASE}/students/${studentToFind}`);
            const data = await response.json();
            setCoursesForStudent(data.courses);
        };
        fetchCoursesForStudent();

        }, [studentToFind, currentGrade]
    );

    // const handleGetGrade = (e) => {
    //     e.preventDefault()
    //     const getUrl = `${API_BASE}/students/${studentToFind}/${courseToFind}/grade`
    //     fetch(getUrl, {
    //         method: 'GET',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         }
    //         })
    //     .then((res)=>{
    //         res.json()
    //     })
    //     .then((data) => {
    //         console.log("data: ", data)
    //         setCurrentGrade(data)
    //     })
    //     .then(()=> console.log("currentGrade: ", currentGrade))
    //     .catch(err => console.log("Error: ", err))
    // }

    const convertGradePointsToLetterGrade = (gradePoints) => {
        const gradeConversionArray = ['F', 'D', 'C', 'B', 'A']
        let conversion = gradeConversionArray[gradePoints]
        return conversion
    }

    return(
        
            <div>
                <div>
                    <div className="row">
                        <form>
                            <label>Student: </label>
                            <select onChange={(e) => {
                                const selectedStudent = e.target.value
                                setStudentToFind(selectedStudent)
                                console.log(`Grades.js line 85. studentToFind: ${studentToFind}`)
                            }}>
                                <option value="Select a student">---Select a student---</option>
                                {students.map(student => (
                                    <option value={student._id}>{student.name}</option>
                                ))}
                            </select>
                        </form>
                    </div>
                    <div className="row">
                        {coursesForStudent ?
                        <form>
                            <label>Course: </label>
                            <select onChange={(e) => {
                                const selectedCourse = e.target.value // the courseName str
                                console.log("selectedCourse: ", selectedCourse)
                                const selectedCourseToFetch = selectedCourse.toLowerCase().replace(/ /g, '-')
                                // const selectedCourseForStudentObj = coursesForStudent.find(course => course.courseName === selectedCourse)
                                // setCourseToFind(selectedCourseToFetch)
                                console.log(`Grades.js line 101. selectedCourseToFetch: ${selectedCourseToFetch}`)
                                
                                // get all students
                                console.log("students: ", students)
                                // find indiv student by id
                                let selectedStudentDbId = studentToFind
                                console.log("studentToFind: ", selectedStudentDbId)
                                let selectedStudentObj = students.find(student => student._id === selectedStudentDbId)
                                console.log("selectedStudentObj: ", selectedStudentObj)
                                let coursesForSelStu = selectedStudentObj.courses
                                console.log("coursesForSelStu: ", coursesForSelStu)
                                let courseToFindGradeFor = coursesForSelStu.find(course => course.courseName === selectedCourse)
                                console.log("Grades.js line 124. courseToFindGradeFor: ", courseToFindGradeFor)
                                let gradeForSelCourse = courseToFindGradeFor.grade
                                console.log("gradeForSelCourse: ", gradeForSelCourse)
                                setCurrentGrade(convertGradePointsToLetterGrade(gradeForSelCourse))
                            }}>
                                <option value="Select a course">---Select a course---</option>
                                {coursesForStudent.map(course => (
                                    <option value={course.courseName}>{course.courseName}</option>
                                ))}
                            </select>
                            {/* <button type="submit">Submit</button> */}
                        </form>
                        :
                        null
                        }
                    </div>

                    <div className="grade-container">
                        {currentGrade ? <h4>Grade:</h4> : null}
                        <div className="grade">
                            {currentGrade}
                        </div>
                    </div>
                    
                </div>
            </div>
        
    )
}

export default Grades2