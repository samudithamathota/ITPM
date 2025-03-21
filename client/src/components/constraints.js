import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for routing

const TimetableConstraints = () => {
  const [semester, setSemester] = useState("");

  useEffect(() => {
    axios
      .get("/api/user") // Fetch semester data (Assuming backend API exists)
      .then((response) => setSemester(response.data.semester))
      .catch((error) => console.error("Error fetching semester data:", error));
  }, []);

  return (
    <div id="wrapper" style={styles.wrapper}>
      <header style={styles.header}>
        <h1 className="mainheader">FET Time Tables</h1>
        <Link to="/data" style={styles.button}>
          Go to Data
        </Link>{" "}
        {/* Button on top-right */}
      </header>
      <div id="mainForm" style={styles.mainForm}>
        <fieldset style={styles.fieldset}>
          <legend>
            {semester.charAt(0).toUpperCase() + semester.slice(1)}
          </legend>
          <Navigation />
          <Article />
        </fieldset>
      </div>
      <Footer />
    </div>
  );
};

const Navigation = () => {
  return (
    <nav style={styles.nav}>
      {/* Navigation items can go here */}
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/data">Data</Link>
        </li>
      </ul>
    </nav>
  );
};

const Article = () => {
  return (
    <article id="box" style={styles.article}>
      {/* Tabs and Content */}
      <h1>Activities will be implemented soon</h1>
    </article>
  );
};

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>© 2025 FET Timetables. All rights reserved.</p>
    </footer>
  );
};

// Inline styles for the page layout
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  header: {
    background: "#007BFF",
    padding: "20px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    background: "#ffffff",
    color: "#007BFF",
    padding: "10px 20px",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "16px",
  },
  mainForm: {
    flex: 1,
    padding: "20px",
    background: "#f4f4f4",
    overflowY: "auto",
  },
  fieldset: {
    border: "1px solid #ccc",
    padding: "20px",
  },
  nav: {
    marginBottom: "20px",
  },
  article: {
    background: "#fff",
    padding: "20px",
    borderRadius: "5px",
  },
  footer: {
    background: "#333",
    color: "white",
    padding: "10px",
    textAlign: "center",
  },
};

export default TimetableConstraints;
