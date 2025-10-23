// Dashboard.js
import React from "react";
import { AdminSideBar, Header } from "..";

const AdminDashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <AdminSideBar />
        <div className="flex-1 overflow-y-auto bg-gray-100">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
