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
import DashboardLayout from './pages/post/layouts/DashboardLayout';
import ShareDetail from './pages/post/share/ShareDetail';
import ShareList from './pages/post/share/ShareList';
import ShareWrite from './pages/post/share/ShareWrite';
import GuideDetail from './pages/post/guide/GuideDetail';
import GuideList from './pages/post/guide/GuideList';
import GuideWrite from './pages/post/guide/GuideWrite';

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
          
        </Route>
        {/* 로그인 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
