import React from "react";
import { AppShell } from "@mantine/core";
import "./Dashboard.css";
import { useAuth } from "../../context/AuthContext";
import SchoolAdminDashBoard from "./SchooAdminDashBoard/Component/SchoolAdminDashBoard";
import { Outlet } from "react-router-dom";
import AdminDashBoard from "./AdminDashBoard/Component/AdminDashBoard";
import TrustDashBoard from "./TrustDashBoard/Component/TrustDashBoard";
import FacultyDashBoard from "./FacultyDashBoard/Component/FacultyDashBoard";

const Dashboard = () => {
  const { userDetails } = useAuth();

  const userType = userDetails?.user_level || "";

  let content;

  switch (userType) {
    case "School":
      content = <SchoolAdminDashBoard />;
      break;

    case "Admin":
      content = <AdminDashBoard />;
      break;

    case "Trust":
      content = <TrustDashBoard />;
      break;

    case "Faculty":
      content = <FacultyDashBoard />;
      break;

    default:
      content = null;
      break;
  }

  return (
    <AppShell padding="md" style={{ backgroundColor: "#F5F5F5" }}>
      <AppShell.Main>{content}</AppShell.Main>
    </AppShell>
  );
};

export default Dashboard;
