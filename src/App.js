import { BrowserRouter, Routes, Route } from "react-router-dom";
import Schedule from "./pages/schedule/Schedule";
import Project from "./pages/project/ProjectHome"
import SubProject from "./pages/project/Project"
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/Header/Header";
import { createGlobalStyle } from 'styled-components';

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
        <Route path="/project" element={<Project />} />
        <Route path="/project/subProject" element={<SubProject />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
