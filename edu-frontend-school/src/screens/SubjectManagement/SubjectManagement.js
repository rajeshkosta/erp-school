import { AppShell } from "@mantine/core";
import React from "react";
import { Outlet } from "react-router-dom";

const SubjectManagement = () => {
  return (
    <AppShell padding="md" style={{ backgroundColor: "#F5F5F5" }}>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default SubjectManagement;
