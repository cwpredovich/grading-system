import { useState, useEffect } from "react"

const API_BASE = "http://localhost:3001"

const Courses2 = () => {

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
            <div>
                <div className="row col-12 grid-item col-header page-header">
                    Course Name
                </div>
                {courseCatalog.map(course => 
                    <div className="col-12 grid-item course-listing">{course.courseName}</div>
                )}
            </div>
            <button onClick={() => setIsNewCourseFormShowing(!isNewCourseFormShowing)}>Add New Course</button>
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

            
        </div>
    )
}

export default Courses2