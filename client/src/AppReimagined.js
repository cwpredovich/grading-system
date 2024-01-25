import './AppReimagined.css';
import Students2 from "./components/Students2";
import Courses2 from "./components/Courses2";
import Grades2 from "./components/Grades2";
import Login from "./components/Login";
import { useState } from "react";


function App2() {

    const [view, setView] = useState('students')
  
    const renderSwitch = (view) => {
        switch(view) {
            case 'courses':
                return <Courses2 />
            case 'search grades':
                return <Grades2 />
            default:
                return <Students2 />
        }
    }

    const styles = {
        students: {
            backgroundColor: view === 'students' ? 'white' : '#d9d9d9',
            color: view === 'students' ? '#325db4' : 'black'
        },
        courses: {
            backgroundColor: view === 'courses' ? 'white' : '#d9d9d9',
            color: view === 'courses' ? '#325db4' : 'black'
        },
        search: {
            backgroundColor: view === 'search grades' ? 'white' : '#d9d9d9',
            color: view === 'search grades' ? '#325db4' : 'black'
        }
    }

    return (
        <div className="lg-grid-container">
            {/* nice, wide banner/header across the top of the page */}
            <header className="row">
                <div className="col-12 grid-item">Galactic Grades</div>
            </header>

            <div className="md-grid-container">
                <div className="row">
                    {/* vertical bar for navigation */}
                    <nav className="col-2">
                        <div className="nav-links-pages">
                            <div className="grid-item nav-btn" style={styles.students} onClick={() => setView('students')}>
                                Students
                            </div>
                            <div className="grid-item nav-btn" style={styles.courses} onClick={() => setView('courses')}>
                                Courses
                            </div>
                            <div className="grid-item nav-btn" style={styles.search} onClick={() => setView('search grades')}>
                                Search Grade
                            </div>
                        </div>
                        <div className="nav-links-auth">
                            {/* {isLoggedIn ? <button onClick={() => setIsLoggedIn(!isLoggedIn)}>Log Out</button> : <button onClick={() => setIsLoggedIn(!isLoggedIn)}>Log In</button>} */}
                            <Login />
                            {/* <div className="grid-item nav-btn auth">Login/Logout</div> */}
                        </div>
                    </nav>

                    {/* rectangle that takes up the rest of the page */}
                    <main className="col-10 sm-grid-container">
                        {renderSwitch(view)}
                    </main>
                </div>
                
            </div>
        </div>
    )
}

export default App2;