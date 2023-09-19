import { useState, useEffect } from "react"

const API_BASE = "http://localhost:3001"

const Courses = () => {

    const [courseCatalog, setCourseCatalog] = useState([])
    const [isNewCourseFormShowing, setIsNewCourseFormShowing] = useState(false)
    const [newCourse, setNewCourse] = useState({})

    const GetCourses = () => {
        fetch(API_BASE + "/courses/")
            .then(res => res.json())
            .then(data => setCourseCatalog(data))
            .catch(err => console.log("Error: ", err))
    }

    useEffect(() => {
        GetCourses()
    }, [])

    const handleSubmit = () => {
        const postUrl = API_BASE + "/courses"
        fetch(postUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                courseName: newCourse.courseName
            })
        })
        .then(()=>{
            alert('New course has been added to the system!');
        })
    }

    return(
        <div>
            <h3>All Courses:</h3>
            <button onClick={() => setIsNewCourseFormShowing(!isNewCourseFormShowing)}>+ Add Course</button>
            {isNewCourseFormShowing ? 
                <form onSubmit={handleSubmit}>
                    <label>Course Name: </label>
                    <input 
                        type="text" 
                        value={newCourse.courseName}
                        onChange={(e) => {
                            const courseAddition = {courseName: e.target.value}
                            setNewCourse(courseAddition)
                        }}>
                    </input>
                    <button type="submit">Submit</button>
                </form>
                :
                null
            }

            <ol>
                {courseCatalog.map(course => 
                    <li>{course.courseName}</li>
                )}
            </ol>
        </div>
    )
}

export default Courses