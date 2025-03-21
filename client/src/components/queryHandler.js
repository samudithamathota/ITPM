import axios from "axios";

const API_URL = "http://localhost:8070/"; // Adjust the endpoint as per your backend

const QueryHandler = {
  createNew: async (query) => {
    try {
      const response = await axios.post(
        `${API_URL}createNew/add?query=${query}`
      );
      return response.data;
    } catch (error) {
      console.error("Error creating new entry:", error);
      return null;
    }
  },

  updateRow: async (query, id) => {
    try {
      const response = await axios.put(
        `${API_URL}updateRow/update?query=${query}&id=${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating entry:", error);
      return null;
    }
  },

  deleteRow: async (query, id) => {
    try {
      const response = await axios.delete(
        `${API_URL}destroy/delete?query=${query}&id=${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting entry:", error);
      return null;
    }
  },

  getAll: async (query) => {
    try {
      const response = await axios.get(`${API_URL}queryAll?query=${query}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all entries:", error);
      return [];
    }
  },

  getSingle: async (query, id) => {
    try {
      const response = await axios.get(
        `${API_URL}queryOne/getOne?query=${query}&id=${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching single entry:", error);
      return null;
    }
  },
};

export default QueryHandler;
