import axios from "axios";

const API = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    "Content-Type": 'application/json'
  }
});

// Normal User APIs
export const loginUser = async (loginData) => {
  const response = await API.post('/auth/login', loginData);
  return response.data;
};

export const signupUser = async (userData) => {
  const response = await API.post('/auth/signup', userData);
  return response.data;
};

// Admin APIs
export const signupAdmin = async (adminData) => {
  const response = await API.post('/auth/admin/signup', adminData);
  return response.data;
};

export const loginAdmin = async (adminLoginData) => {
  const response = await API.post('/auth/admin/login', adminLoginData);
  return response.data;
};

// Crop APIs
export const fetchAllCrops = async () => {
  const response = await API.get('/crops');
  return response.data;
};

export const createCrop = async (cropData) => {
  const response = await API.post('/crops', cropData);
  return response.data;
};

export const updateCrop = async (cropId, cropData) => {
  const response = await API.put(`/crops/${cropId}`, cropData);
  return response.data;
};

export const deleteCrop = async (cropId) => {
  const response = await API.delete(`/crops/${cropId}`);
  return response.data;
};

export default API;