import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TimeTables = () => {
  const [semester, setSemester] = useState("");
  const [institution, setInstitution] = useState("");
  const [comments, setComments] = useState("");
  const [existingSemesters, setExistingSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const userName = localStorage.getItem("username");

  // Fetch Existing Semesters
  useEffect(() => {
    axios
      .get(`/api/semesters/${userName}`)
      .then((res) => {
        console.log("Fetched Semesters:", res.data);
        setExistingSemesters(res.data);
      })
      .catch((err) => console.error("Error fetching semesters:", err));
  }, [userName]);

  // Create a New Table
  const handleCreateTable = async (e) => {
    e.preventDefault();
    await axios.post("/api/createTable", {
      semester,
      institution,
      comments,
      user_name: userName,
    });
    alert("Table Created!");
    setSemester("");
    setInstitution("");
    setComments("");
  };

  // Upload File
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a .fet file!");

    const formData = new FormData();
    formData.append("user-file", file);
    formData.append("semester", selectedSemester);

    await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("File Uploaded Successfully!");
  };

  return (
    <div className="container">
      <h1>AcademiSync Time Tables</h1>

      <form onSubmit={handleCreateTable}>
        <h2>Create a New Table</h2>
        <input
          type="text"
          placeholder="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Institution Name"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          required
        />
        <textarea
          placeholder="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        <button type="submit">Create Table</button>
      </form>

      <button
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default TimeTables;
