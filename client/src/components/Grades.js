import { useState, useEffect } from "react"

const API_BASE = "http://127.0.0.1:3001"

const Grades = () => {

    const [students, setStudents] = useState([])
    const [studentToFind, setStudentToFind] = useState('')
    const [coursesForStudent, setCoursesForStudent] = useState([])
    const [courseToFind, setCourseToFind] = useState({})

    const [currentGrade, setCurrentGrade] = useState('')
    
    const GetStudents = () => {
        fetch(`${API_BASE}/students`)
            .then(res => res.json())
            .then(data => setStudents(data))
            .catch(err => console.log("Error: ", err))
    }
    
    // const GetGrade = () => {
    //     fetch(`${API_BASE}/students/${studentToFind._id}/${courseToFind}/grade`)
    //         .then(res => res.json())
    //         .then(data => setCurrentGrade(data))
    //         .catch(err => console.log("Error: ", err))
    // }


    
    useEffect(() => {
        GetStudents()
        const fetchCoursesForStudent = async () => {
            const response = await fetch(`${API_BASE}/students/${studentToFind}`);
            const data = await response.json();
            setCoursesForStudent(data.courses);
        };
        fetchCoursesForStudent();

        // const fetchGrade = () => {
        //     console.log("hello world")
        //     const course = coursesForStudent.find((course, index) => course.courseName === courseToFind.courseName)
        //     setCurrentGrade(course.grade)
        // }

        // fetchGrade()

        // setCurrentGrade(studentToFind.courses.find(course => course.courseName === courseToFind).grade)

        }, [studentToFind]
    );
    
    
    // const GetCoursesForStudent = (studentDbId) => {
    //     fetch(`${API_BASE}/students/${studentDbId}`)
    //         .then(res => res.json())
    //         .then(data => setCoursesForStudent(data.courses))
    //         .catch(err => console.log("Error: ", err))
    // }

    const handleGetGrade = (e) => {
        e.preventDefault()
        const getUrl = `${API_BASE}/students/${studentToFind._id}/${courseToFind}/grade`
        fetch(getUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            })
        .then(()=>{
            alert('New course has been added to the system!');
        })
    }

    return(
        
            <div>
                <h3>Search Student Grades:</h3>
                <div>
                    <form onSubmit={handleGetGrade}>
                        <label>Student: </label>
                        <select onChange={(e) => {
                            const selectedStudent = e.target.value
                            setStudentToFind(selectedStudent)
                            console.log(studentToFind)
                        }}>
                            <option value="Select a student">---Select a student---</option>
                            {students.map(student => (
                                <option value={student._id}>{student.name}</option>
                            ))}
                        </select>
                    </form>
                    {coursesForStudent ?
                    <form>
                        <label>Course: </label>
                        <select onChange={(e) => {
                            const selectedCourse = e.target.value // the courseName str
                            const selectedCourseForStudentObj = coursesForStudent.find(course => course.courseName === selectedCourse)
                            setCourseToFind(selectedCourseForStudentObj)
                            console.log(courseToFind)
                            
                        }}>
                            <option value="Select a course">---Select a course---</option>
                            {coursesForStudent.map(course => (
                                <option value={course.courseName}>{course.courseName}</option>
                            ))}
                        </select>
                        <button type="submit">Submit</button>
                    </form>
                    :
                    null
                    }

                    <div>
                        {currentGrade}
                    </div>
                    
                </div>
            </div>
        
    )
}

export default Grades