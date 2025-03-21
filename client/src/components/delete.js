import React, { useState } from "react";
import axios from "axios";

const FileDeletion = () => {
  const [status, setStatus] = useState("");

  const handleDelete = () => {
    axios
      .post("/api/delete-files", {
        directory: "/home/mctom03/public_html/Project/uploads/example",
        file: "/home/mctom03/public_html/Project/uploads/3gibson/example",
      })
      .then((response) => {
        console.log("Delete response:", response.data);
        setStatus("Files and directories deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting files:", error);
        setStatus("Error deleting files.");
      });
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete Files</button>
      <p>{status}</p>
    </div>
  );
};

export default FileDeletion;
