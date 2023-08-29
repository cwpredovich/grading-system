import { useState, useEffect } from 'react'

const API_BASE = "http://127.0.0.1:3001"


function Students() {
    const [students, setStudents] = useState([])
    const [isNewStudentFormShowing, setIsNewStudentFormShowing] = useState(false)
    
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

    const Header = () => {
        return(
            <div>
                <h3>All Students:</h3>
                <button 
                    onClick={() => setIsNewStudentFormShowing(!isNewStudentFormShowing)}>
                        + Add Student
                </button>
            </div>
        )
    }

    // TODO:  Build this form and connect it to the db
    const NewStudentForm = () => {
        return(
            <div>
                <form>
                    <input type='text' placeholder='add new student form'></input>
                </form>
            </div>
        )
    }

    const StudentList = () => {
        return(
            <ol>
                {
                    students.map(student => (
                        // TODO:  give these buttons an onClick function which 
                        <li><button>{student.name}, {student.gpa} GPA</button></li>
                        
                    ))
                }
            </ol>
        )
    }

    return !isNewStudentFormShowing ? (
        <div>
            <Header />
            <StudentList />
        </div>
    ) :
    (
        <div>
            <Header />
            <NewStudentForm />
            <StudentList />
        </div>
    )
}

export default Students