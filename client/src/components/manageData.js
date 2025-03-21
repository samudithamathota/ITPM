import React, { useState, useEffect } from "react";
import QueryHandler from "./queryHandler";

const ManageData = () => {
  const [data, setData] = useState([]);
  const [singleData, setSingleData] = useState(null);

  useEffect(() => {
    // Fetch all data when the component mounts
    const fetchData = async () => {
      const result = await QueryHandler.getAll();
      setData(result);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await QueryHandler.deleteRow(id);
    setData(data.filter((item) => item.id !== id)); // Update UI after deletion
  };

  const handleSingleFetch = async (id) => {
    const result = await QueryHandler.getSingle(id);
    setSingleData(result);
  };

  return (
    <div>
      <h2>Data Management</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.name}{" "}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <button onClick={() => handleSingleFetch(1)}>Fetch Single Data</button>
      {singleData && <p>Fetched Data: {JSON.stringify(singleData)}</p>}
    </div>
  );
};

export default ManageData;
