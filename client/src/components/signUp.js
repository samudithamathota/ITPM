import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../formStyle.css";

const signUp = () => {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (pwd !== pwd2) {
      alert("Passwords do not match!");
      return;
    }
    try {
      console.log("Sending signup request...");
      const response = await axios.post("/api/signup", { id, pwd });
      console.log("Response:", response.data);

      if (response.data.success) {
        alert("Signup successful! Redirecting...");
        navigate("/index");
      } else {
        alert(response.data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error signing up. Check console.");
    }
  };

  return (
    <div id="wrapper">
      <header>
        <h1 className="mainheader">AcademiSync Signup</h1>
      </header>
      <form onSubmit={handleSignup}>
        <fieldset>
          <legend>Create User</legend>
          <label>User ID:</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
          <label>Confirm Password:</label>
          <input
            type="password"
            value={pwd2}
            onChange={(e) => setPwd2(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
          <button type="button" onClick={() => navigate("/index")}>
            Login
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default signUp;
