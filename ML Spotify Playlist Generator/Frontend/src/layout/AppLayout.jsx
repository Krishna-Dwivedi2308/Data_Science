import React from "react";
import { Outlet } from "react-router";
import Header from "../components/Header";
import LandingPage from "../pages/LandingPage";
import { Toaster } from "@/components/ui/sonner";
const AppLayout = () => {
  return (
    <div>
      <main>
        {" "}
        //className="m-10 p-10"
        {/* <LandingPage/> */}
        <Outlet />
      </main>
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default AppLayout;
