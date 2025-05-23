// src/api/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",  //추후 baseurl 변경
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default instance;
