import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calendar from "./pages/calendar/Calendar";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Sidebar />
      <Routes>
        {/* <Route path="/calendar" element={<Calendar />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
