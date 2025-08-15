import MainLayout from "./components/layout/MainLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/content/dashboard/Dashboard";
import Users from "./components/content/administration/Users";
import Role from "./components/content/administration/Role";
import Expenses from "./components/content/financing/Expenses";
import Permission from "./components/content/administration/Permission";
import Login from "./components/auth/Login";
import { useEffect } from "react";
import { MainEnum } from "./configs/enums/main.enum";
import Jobs from "./components/content/schedules/Jobs";
import Journeys from "./components/content/schedules/Journeys";

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem(MainEnum.APP_TOKEN);

    if (!token) {
      const browserlink = window.location.href;
      const pathParts = new URL(browserlink).pathname
        .split("/")
        .filter(Boolean);
      const lastPart = pathParts.length ? pathParts.pop() : "";

      if (lastPart !== "login") {
        window.location.href = "/login";
      }
    }
  }, []);

  useEffect(() => {
    // Push a new state so back button doesn't navigate away
    window.history.pushState(null, "", window.location.pathname);

    const handleBackButton = (event: any) => {
      event.preventDefault();
      window.history.pushState(null, "", window.location.pathname);
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/roles" element={<Role />} />
            <Route path="/permissions" element={<Permission />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/journeys" element={<Journeys />} />
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
