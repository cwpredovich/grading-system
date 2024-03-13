import { useState, useEffect } from "react"
import '../AppReimagined.css'

const API_BASE = "http://127.0.0.1:3001"

const Grades2 = () => {

    const [students, setStudents] = useState([])
    // string holding the db id for the selected student (not the student id #; this is actually the mongodb id #)
    const [studentToFind, setStudentToFind] = useState('')
    const [coursesForStudent, setCoursesForStudent] = useState([])
    // const [courseToFind, setCourseToFind] = useState({})

    const [currentGrade, setCurrentGrade] = useState('')
    const [editingGrade, setEditingGrade] = useState(false)
    const [courseToFind, setCourseToFind] = useState('')
    const [gradeEdit, setGradeEdit] = useState('')

    
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
            // fetch the student's courses array, which has 
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

    const resetCourseListAndGrade = () => {
        setCoursesForStudent([])
        setCurrentGrade('')
    }

    const editGrade = () => {
        setEditingGrade(!editingGrade)
        // setCurrentGrade('')
    }

    const convertLetterGradeToGradePoints = (grade) => {
        const gradeConversionArray = ['f', 'd', 'c', 'b', 'a']
        let conversion = gradeConversionArray.indexOf(grade.toLowerCase())
        return conversion
    }

    const handleSubmitNewGrade = () => {
        console.log("submit new grade clicked")
        console.log(courseToFind)
        //   1. Set up the body of the PUT request
        //     1a. Lower case the course name and replace spaces with hyphens
        //         this is the /:course part of the PUT request
        let convertedCourseName = courseToFind.courseName.toLowerCase().replace(/ /g, '-')
        //     1b. Store the /:student part of the PUT request
        let studentDbId = studentToFind

        // newGrade is the body of the PUT request
        // it is the /grade part of the PUT request
        let newGrade = convertLetterGradeToGradePoints(gradeEdit)

        const putUrl = `${API_BASE}/students/${studentDbId}/${convertedCourseName}/grade`

        fetch(putUrl, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // should i be sending a letter grade or the numerical grade points to the back end?
                grade: newGrade
            })
        }).then(() => {
            alert("Grade changed!")
        })
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
                                resetCourseListAndGrade()
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
                                // console.log("selectedCourse: ", selectedCourse)
                                // const selectedCourseToFetch = selectedCourse.toLowerCase().replace(/ /g, '-')
                                // const selectedCourseForStudentObj = coursesForStudent.find(course => course.courseName === selectedCourse)
                                // setCourseToFind(selectedCourseToFetch)
                                // console.log(`Grades.js line 101. selectedCourseToFetch: ${selectedCourseToFetch}`)
                                
                                // find indiv student by id
                                let selectedStudentDbId = studentToFind
                                // console.log("studentToFind: ", selectedStudentDbId)
                                let selectedStudentObj = students.find(student => student._id === selectedStudentDbId)
                                // console.log("selectedStudentObj: ", selectedStudentObj)
                                let coursesForSelStu = selectedStudentObj.courses
                                // console.log("coursesForSelStu: ", coursesForSelStu)
                                let courseToFindGradeFor = coursesForSelStu.find(course => course.courseName === selectedCourse)
                                setCourseToFind(courseToFindGradeFor)
                                // console.log("Grades.js line 124. courseToFindGradeFor: ", courseToFindGradeFor)
                                
                                
                                // 1.  I need to allow users to edit grades
                                // 2.  After the user selects a student and a course,
                                //     create a variable that holds the path to the grade
                                //     i already have a state variable holding the db id:
                                //     studentToFind
                                //     now when the course is selected, i will have a state var
                                //     storing the course name (all lowercase with )


                                let gradeForSelCourse = courseToFindGradeFor.grade
                                // console.log("gradeForSelCourse: ", gradeForSelCourse)
                                setCurrentGrade(convertGradePointsToLetterGrade(gradeForSelCourse))
                            }}>
                                <option value="Select a course">---Select a course---</option>
                                {coursesForStudent.map(course => (
                                    <option value={course.courseName}>{course.courseName}</option>
                                ))}
                            </select>
                        </form>
                        :
                        null
                        }
                    </div>

                    <div className="grade-container">
                        {currentGrade ? 
                            <div className="grade">
                                {editingGrade ?
                                    <div>
                                        Old Grade: {currentGrade}
                                    </div>
                                :
                                    
                                    <div>
                                        Grade: {currentGrade}
                                    </div>
                                }
                                <div>
                                    {
                                        editingGrade ?
                                            <div>
                                                <form onSubmit={handleSubmitNewGrade}>
                                                    <label>New Grade: </label>
                                                    <select required onChange={(e) => {
                                                        setGradeEdit(e.target.value)
                                                    }}>
                                                        <option value="New Grade">---New Grade---</option>
                                                        <option value="A">A</option>
                                                        <option value="B">B</option>
                                                        <option value="C">C</option>
                                                        <option value="D">D</option>
                                                        <option value="F">F</option>
                                                    </select>
                                                    <button className="green-btn" type='submit'>✏️ Save</button>
                                                </form>
                                                <button className="red-btn" onClick={(e) => editGrade()}>Cancel</button>
                                            </div>
                                        :
                                            <div>
                                                <button className="green-btn" onClick={(e) => editGrade()}>✏️ Change</button>
                                            </div>
                                    }
                                </div> 
                            </div>
                        : 
                        null}
                        
                    </div>
                    
                </div>
            </div>
        
    )
}

export default Grades2