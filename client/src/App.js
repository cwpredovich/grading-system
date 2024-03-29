import Students from "./components/Students";
import Courses from "./components/Courses";
import Grades from "./components/Grades";
import { useState } from "react";


function App() {
  
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [view, setView] = useState('students')
  
  const renderSwitch = (view) => {
    switch(view) {
      case 'courses':
        return <Courses />
      case 'search grades':
        return <Grades />
      default:
        return <Students />
    }
  }
  

  return (
    <div className="app">
      <header>
        <h1>Galactic Grading System</h1>
        <p><i>Do or do not. There is no try. - Master Yoda</i></p>
      </header>
      <main>
        <nav>
          <button className="nav-btn" onClick={() => setView('students')}>Students</button>
          <button className="nav-btn" onClick={() => setView('courses')}>Courses</button>
          <button className="nav-btn" onClick={() => setView('search grades')}>Search Grades</button>
          {/* {isLoggedIn ? <button onClick={() => setIsLoggedIn(!isLoggedIn)}>Log Out</button> : <button onClick={() => setIsLoggedIn(!isLoggedIn)}>Log In</button>} */}
        </nav>
        <div>
          {renderSwitch(view)}
        </div>
      </main>
    </div>
  );
}

export default App;
