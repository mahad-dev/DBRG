import type { FC } from "react";
import "./App.css";
import AppRouter from "./routers";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: FC = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        limit={1}
      />

      <AppRouter />
    </>
  );
};

export default App;
