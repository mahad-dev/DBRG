import { Outlet } from "react-router-dom";
import Header from "./comps/header";
import Footer from "./comps/footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <Header />

      <main className="grow p-0">
        <Outlet /> 
      </main>

      <Footer/>
    </div>
  );
};

export default Layout;
