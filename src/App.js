import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Schedule from "./pages/schedule/Schedule";
import MeetingList from "./pages/meeting/MeetingList";
import MeetingDetail from "./pages/meeting/MeetingDetailForm";
import TaskList from "./pages/task/TaskList";
import TaskDetail from "./pages/task/TaskDetailForm";
//import Project from "./pages/project/ProjectHome"
import Project from "./pages/project/Project";
import TeamProject from "./pages/team/TeamProject";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/Header/Header";
import { createGlobalStyle } from "styled-components";
import LayoutWithoutSidebar from "./LayoutWithoutSidebar";
import { Navigate } from "react-router-dom";


const GlobalStyle = createGlobalStyle`
  body {
    background: #F5F7FA; 
    margin: 0; 
    padding: 0;
  }
`;

function LayoutWithSidebar({ children }) {
  return (
    <>
      <Header />
      <Sidebar />
      <div>{children}</div>
    </>
  );
}

function AppRoutes() {
  const location = useLocation();
  const hideSidebarPaths = ["/teamProject"];
  const isSidebarHidden = hideSidebarPaths.includes(location.pathname);

  return (
    <>
      <GlobalStyle />
      {isSidebarHidden ? (
        <LayoutWithoutSidebar>
          <Routes>
            <Route path="/teamProject" element={<TeamProject />} />
            <Route path="/" element={<Navigate to="/teamProject" />} />
          </Routes>
        </LayoutWithoutSidebar>
      ) : (
        <LayoutWithSidebar>
          <Routes>
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/meetingList" element={<MeetingList />} />
            <Route path="/meetingDetail/:meetingId" element={<MeetingDetail />} />
            <Route path="/meetingCreate" element={<MeetingDetail />} />
            <Route path="/taskList" element={<TaskList />} />
            <Route path="/taskDetail/:taskId" element={<TaskDetail />} />
            <Route path="/taskCreate" element={<TaskDetail />} />
            <Route path="/project" element={<Project />} />
            <Route path="/" element={<Navigate to="/teamProject" />} />
          </Routes>
        </LayoutWithSidebar>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
