import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loginsignup from "./Loginsignup";
import Books from "./Books";
import Lesson from "./Lesson";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginsignup />} />
        <Route path="/Books" element={<Books />} />
        <Route path="/login" element={<Loginsignup/>} />
        <Route path="/Books/:bookId" element={<Lesson />} />
      </Routes>
    </Router>
  );
}

export default App;
