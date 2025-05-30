
// src/api/user.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/users';

// 로그인
const login = async (data) => {
  const res = await axios.post(`${BASE_URL}/login`, data, {
    withCredentials: true,
  });
  return res.data;
};

// 회원가입
const signup = async (data) => {
  const res = await axios.post(`${BASE_URL}/signup`, data);
  return res.data;
};

// 로그인된 사용자 정보 조회
const getCurrentUser = async () => {
  const res = await axios.get(`${BASE_URL}/me`, {
    withCredentials: true,
  });
  return res.data;
=======
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const login = async (data) => {
  const response = await axios.post(`${BASE_URL}/login`, data);
  return response.data;
};

const signup = async (data) => {
  const response = await axios.post(`${BASE_URL}/signup`, data);
  return response.data;

};

