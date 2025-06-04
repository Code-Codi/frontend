import { BrowserRouter, Routes, Route } from "react-router-dom";
import Schedule from "./pages/schedule/Schedule";
import MeetingList from "./pages/meeting/MeetingList";
import MeetingDetail from "./pages/meeting/MeetingDetailForm";
import TaskList from "./pages/task/TaskList";
import TaskDetail from "./pages/task/TaskDetailForm";
//import Project from "./pages/project/ProjectHome"
import Project from "./pages/project/Project";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/Header/Header";
import { createGlobalStyle } from "styled-components";

//게시판
import DashboardLayout from './layouts/DashboardLayout';
import ShareDetail from './pages/share/ShareDetail';
import ShareList from './pages/share/ShareList';
import ShareWrite from './pages/share/ShareWrite';
import GuideDetail from './pages/guide/GuideDetail';
import GuideList from './pages/guide/GuideList';
import GuideWrite from './pages/guide/GuideWrite';

//로그인
import Login from './pages/Login/Login'
import Signup from './pages/Login/Signup'
import { Navigate } from 'react-router-dom';




const GlobalStyle = createGlobalStyle`
  body {
    background: #F5F7FA; 
    margin: 0; 
    padding: 0;
  }
`;

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        {/* 로그인 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      <Header />
      <Sidebar />

      <Routes>
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/meetingList" element={<MeetingList />} />
        <Route path="/meetingDetail/:meetingId" element={<MeetingDetail />} />
        <Route path="/meetingCreate" element={<MeetingDetail />} />
        <Route path="/taskList" element={<TaskList />} />
        <Route path="/taskDetail/:taskId" element={<TaskDetail />} />
        <Route path="/taskCreate" element={<TaskDetail />} />
        <Route path="/project" element={<Project />} />
        <Route path="/project/subProject" element={<Project />} />

        {/* 게시판 */}
        <Route path="/" element={<DashboardLayout/>}>

          <Route path="share" element={<ShareList/>} />
          <Route path="share/:postId" element={<ShareDetail/>} />
           <Route path="share/write" element={<ShareWrite />} />

          <Route path="guide" element={<GuideList/>} />
          <Route path="guide/:postId" element={<GuideDetail/>} />
          <Route path="guide/write" element={<GuideWrite />} />

          {/* 첫화면 */}
          <Route index element={<Navigate to="login" />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
