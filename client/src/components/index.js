import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../formStyle.css";

const Login = () => {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { id, pwd });
      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user info
        navigate("/timetables"); // Redirect to timetable page
      } else {
        alert("Your username or password is incorrect! Please try again!");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignup = () => {
    navigate("/signup"); // Redirect to signup page
  };

  return (
    <div id="wrapper">
      <header>
        <h1 className="mainheader">FET Login</h1>
      </header>
      <form onSubmit={handleLogin}>
        <fieldset style={{ width: "275px", height: "275px", margin: "0 auto" }}>
          <legend>Login</legend>
          <label>User ID:</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <br />
          <label>Password:</label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
          <br />
          <button className="buttons" type="submit">
            Login
          </button>
          <br />
          <button className="buttons" type="button" onClick={handleSignup}>
            Sign Up
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
