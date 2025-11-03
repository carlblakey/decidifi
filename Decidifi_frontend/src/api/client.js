import { create } from "apisauce";

const apiClient = create({
  baseURL: "https://decidify-node-backend.onrender.com/",
  // baseURL: "http://192.168.100.86:8000/",
});

// Function to set the Authorization token
export const setAuthToken = (token) => {
  if (token) {
    apiClient.setHeader("Authorization", `Bearer ${token}`);
  } else {
    apiClient.deleteHeader("Authorization");
  }
};

export const setHeader = () => {
  apiClient.setHeader("Content-Type", "multipart/form-data");
};

export default apiClient;
