import Students from "./components/Students";
import Courses from "./components/Courses";
import Grades from "./components/Grades";

function App() {
  return (
    <div>
      <h1>Galactic Grading System</h1>
      <p><i>Do or do not. There is no try. - Master Yoda</i></p>
      {/* Maybe make this entire page a table with 3 columns:  Students, Courses, and Grades */}
      <div className="container">
        <div className="grid">
          <div><Students /></div>
          <div><Courses /></div>
          <div><Grades /></div>
        </div>
      </div>
    </div>
  );
}

export default App;
