import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { createGlobalStyle } from "styled-components";

import Schedule from "./pages/schedule/Schedule";
import MeetingList from "./pages/meeting/MeetingList";
import MeetingDetail from "./pages/meeting/MeetingDetailForm";
import TaskList from "./pages/task/TaskList";
import TaskDetail from "./pages/task/TaskDetailForm";

// 교수 화면
import ProfessorTaskList from "./pages/task/ProfessorTaskList";
import ProfessorTeamTaskDetail from "./pages/task/ProfessorTeamTaskDetail";
import ProfessorTaskDetail from "./pages/task/ProfessorTaskDetail";
import ProfessorTeamTaskList from "./pages/task/ProfessorTeamTaskList";

import Project from "./pages/project/Project";
import TeamProject from "./pages/team/teamProject";

import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";

// 게시판
import DashboardLayout from "./layouts/DashboardLayout";
import ShareDetail from "./pages/share/ShareDetail";
import ShareList from "./pages/share/ShareList";
import ShareWrite from "./pages/share/ShareWrite";
import GuideDetail from "./pages/guide/GuideDetail";
import GuideList from "./pages/guide/GuideList";
import GuideWrite from "./pages/guide/GuideWrite";

// 로그인
import Login from "./pages/Login/Login";
import Signup from "./pages/Login/Signup";
import Delete from "./pages/Login/Delete";

import LayoutWithoutSidebar from "./LayoutWithoutSidebar";

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
  const hideSidebarPaths = ["/teamProject", "/login", "/signup", "/delete"];
  const isSidebarHidden = hideSidebarPaths.includes(location.pathname);

  return (
    <>
      <GlobalStyle />
      {isSidebarHidden ? (
        <LayoutWithoutSidebar>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/delete" element={<Delete />} />
            <Route path="/teamProject" element={<TeamProject />} />
            <Route path="/" element={<Navigate to="/teamProject" />} />
          </Routes>
        </LayoutWithoutSidebar>
      ) : (
        <LayoutWithSidebar>
          <Routes>
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/meetingList" element={<MeetingList />} />
            <Route
              path="/meetingDetail/:meetingId"
              element={<MeetingDetail />}
            />
            <Route path="/meetingCreate" element={<MeetingDetail />} />
            <Route path="/taskList" element={<TaskList />} />

            {/* 교수용 */}
            <Route path="/professor/taskList" element={<ProfessorTaskList />} />
            <Route
              path="/professor/taskDetail/:taskGuideId"
              element={<ProfessorTaskDetail />}
            />
            <Route
              path="/professor/team/taskList"
              element={<ProfessorTeamTaskList />}
            />
            <Route
              path="/professor/team/taskDetail/:taskId"
              element={<ProfessorTeamTaskDetail />}
            />
            <Route
              path="/professor/taskCreate"
              element={<ProfessorTaskDetail />}
            />

            <Route path="/taskDetail/:taskId" element={<TaskDetail />} />
            <Route path="/taskCreate" element={<TaskDetail />} />
            <Route path="/project" element={<Project />} />
            <Route path="/project/subProject" element={<Project />} />

            {/* 게시판 */}
            <Route path="/" element={<DashboardLayout />}>
              <Route path="share" element={<ShareList />} />
              <Route path="share/:postId" element={<ShareDetail />} />
              <Route path="share/write" element={<ShareWrite />} />

              <Route path="guide" element={<GuideList />} />
              <Route path="guide/:postId" element={<GuideDetail />} />
              <Route path="guide/write" element={<GuideWrite />} />

              <Route index element={<Navigate to="/login" />} />
            </Route>
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
