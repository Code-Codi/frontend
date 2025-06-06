import Header from "./components/Header/Header";

export default function LayoutWithoutSidebar({ children }) {
  return (
    <>
      <Header /> {}
      <div>{children}</div>
    </>
  );
}
