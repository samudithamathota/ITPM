import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TimetableConstraints from "./components/constraints"; // Correct import path
import Data from "./components/data"; // Correct import path
import FileDeletion from "./components/delete"; // Correct import path
import Generate from "./components/generate"; // Correct import path
import Login from "./components/index"; // Correct import path (ensure the correct file name)
import ManageData from "./components/manageData"; // Correct import path
import "./App.css"; // Make sure this file exists and is correctly styled

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TimetableConstraints />} />
        <Route path="/data" element={<Data />} />
        <Route path="/delete" element={<FileDeletion />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/index" element={<Login />} />{" "}
        {/* Ensure the Login path is correct */}
        <Route path="/manageData" element={<ManageData />} />
      </Routes>
    </Router>
  );
}

export default App;
