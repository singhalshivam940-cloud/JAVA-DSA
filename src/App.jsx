
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import Papers from "./pages/Papers";
import Revision from "./pages/Revision";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <h2>StudySmart</h2>

        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/notes">Notes</NavLink>
          <NavLink to="/papers">Previous Papers</NavLink>
          <NavLink to="/revision">Revision</NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/papers" element={<Papers />} />
        <Route path="/revision" element={<Revision />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
