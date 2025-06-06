import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/Header/Header";

export default function DashboardLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* Sidebar – flow 안에 포함 */}
      <div style={{ width: "248px" }}>
        <Sidebar />
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ height: "80px" }}>
          <Header />
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#F6F9FC",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
