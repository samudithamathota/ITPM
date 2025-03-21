import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "./navigation";
import Footer from "./footer";
import "../formStyle.css";

const Generate = () => {
  const [semester, setSemester] = useState("");
  const [xmlData, setXmlData] = useState("");

  useEffect(() => {
    axios
      .get("/api/get-semester")
      .then((response) => {
        console.log("Semester data fetched:", response.data);
        setSemester(response.data.semester);
      })
      .catch((error) => {
        console.error("Error fetching semester data:", error);
      });
  }, []);

  useEffect(() => {
    if (semester) {
      axios
        .post("/api/generate-timetable", { semester })
        .then((response) => {
          console.log("Timetable data fetched:", response.data);
          setXmlData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching timetable data:", error);
        });
    }
  }, [semester]);

  return (
    <div id="wrapper">
      <header>
        <h1 className="mainheader">FET Time Tables</h1>
      </header>
      <div id="mainForm">
        <fieldset>
          <legend>
            {semester
              ? semester.charAt(0).toUpperCase() + semester.slice(1)
              : "Loading..."}
          </legend>
          <Navigation />
          <article id="box">
            {xmlData ? <pre>{xmlData}</pre> : <p>Loading timetable...</p>}
          </article>
        </fieldset>
      </div>
      <Footer />
    </div>
  );
};

export default Generate;
