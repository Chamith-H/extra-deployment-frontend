import MainLayout from "./components/layout/MainLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/content/dashboard/Dashboard";
import Users from "./components/content/administration/Users";
import Role from "./components/content/administration/Role";
import Expenses from "./components/content/financing/Expenses";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/roles" element={<Role />} />
            <Route path="/expenses" element={<Expenses />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        toastClassName="toast-custom-style"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}
