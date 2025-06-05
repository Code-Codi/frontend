// src/api/board.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/post';

export const getPosts = (type, page) =>
  axios.get(`${BASE_URL}/${type}`, { params: { page } });

export const getPost = (type, id) =>
  axios.get(`${BASE_URL}/${type}/${id}`);

export const getComments = (postId) =>
  axios.get(`${BASE_URL}/${postId}/comments`);

export const getPopular = () =>
  axios.get(`${BASE_URL}/share/popular`);

export const createPost = (formData) =>
  axios.post(`${BASE_URL}/posts`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const postComment = (postId, comment) =>
  axios.post(`${BASE_URL}/${postId}/comments`, comment);

// 게시글 삭제
export const deletePost = (postId) => {
  return axios.delete(`${BASE_URL}/${postId}`);
};

// 댓글 삭제
export const deleteComment = (commentId, postId) => {
  return axios.delete(`${BASE_URL}/${postId}/comments/${commentId}`);
};

// 좋아요 증가
export const favoritePost = (postId) =>
  axios.post(`${BASE_URL}/${postId}/favorite`);
