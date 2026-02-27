import { Outlet } from "react-router-dom";
import Navbar from "../components/public/Navbar.jsx";
import Footer from "../components/public/Footer.jsx";

export default function PublicLayout() {
  return (
    <div className="public-shell">
      <Navbar />
      <main className="public-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}