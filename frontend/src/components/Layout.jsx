import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-4">
        {children}
      </div>
    </>
  );
}

export default Layout;
