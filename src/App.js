import { BrowserRouter, Routes, Route } from "react-router-dom";
import Schedule from "./pages/schedule/Schedule";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
