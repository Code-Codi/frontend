import axios from 'axios';

/*const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 백엔드 주소로 바꿔 주세요!
});*/

// const dummyPosts = [
//   { id: 1, title: '더미 글', teamName: 'Team A', favorites: 7, createdAt: '2025-05-22' },
//   // …
// ];

// const dummyPopular = [
//   {
//     id: 101,
//     title: '파이어베이스 채팅앱 완성본',
//     teamName: 'Team Alpha',
//     category: 'web',
//     visitors: 523,
//     favorites: 34,
//     thumbnail: 'https://via.placeholder.com/320x180.png?text=ChatApp',
//     createdAt: '2025-05-20'
//   },
//   {
//     id: 88,
//     title: 'AI 그림 추천 앱',
//     teamName: 'Team Bravo',
//     category: 'app',
//     visitors: 418,
//     favorites: 29,
//     thumbnail: 'https://via.placeholder.com/320x180.png?text=AI+Art',
//     createdAt: '2025-05-15'
//   },
//   {
//     id: 76,
//     title: '실시간 주가 대시보드',
//     teamName: 'Team Charlie',
//     category: 'web',
//     visitors: 395,
//     favorites: 25,
//     thumbnail: 'https://via.placeholder.com/320x180.png?text=Stocks',
//     createdAt: '2025-05-10'
//   }
// ];

export const getPosts    = (type, page)      =>
  api.get(`/${type}`,        { params: { page } });

export const getPost     = (type, id)        =>
  api.get(`/${type}/${id}`);

export const getComments = (postId)          =>
  api.get(`/comments/${postId}`);

export const getPopular  = ()                =>
  api.get('/share/popular');

// CREATE (추가) ---------------------
export const createPost  = (type, dto)       =>
  api.post(`/${type}`, dto);

export const postComment = (postId, comment) =>
  axios.post(`/api/posts/${postId}/comments`, comment);