import Header from "./components/header/Header";

export default function LayoutWithoutSidebar({ children }) {
  return (
    <>
      <Header /> {}
      <div>{children}</div>
    </>
  );
}
