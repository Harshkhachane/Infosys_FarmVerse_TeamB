import axios from "axios";

// Axios Instance Creation
const API = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    "Content-Type": 'application/json'
  }
});

// 1. Login Function Export
export const loginUser = async (loginData) => {
  // Apne Spring Boot ke Login Endpoint (/auth/login ya /auth/signin) ke hisaab se URL check karein
  const response = await API.post('/auth/login', loginData);
  return response.data;
};

// 2. Signup/Register Function Export
export const signupUser = async (userData) => {
  // Apne Spring Boot ke Signup Endpoint (/auth/signup ya /auth/register) ke hisaab se URL check karein
  const response = await API.post('/auth/signup', userData);
  return response.data;
};

export default API;