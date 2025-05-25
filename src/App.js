import { BrowserRouter, Routes, Route } from "react-router-dom";
import Schedule from "./pages/schedule/Schedule";
import MeetingList from "./pages/meeting/MeetingList";
import MeetingDetail from "./pages/meeting/MeetingDetailForm";
import TaskList from "./pages/task/TaskList";
import TaskDetail from "./pages/task/TaskDetailForm";
//import Project from "./pages/project/ProjectHome"
import Project from "./pages/project/Project";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import { createGlobalStyle } from "styled-components";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
