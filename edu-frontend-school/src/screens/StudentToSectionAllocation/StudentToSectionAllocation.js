import { AppShell } from "@mantine/core";
import React from "react";
import { Outlet } from "react-router-dom";

const StudentToSectionAllocation = () => {
  return (
    <AppShell padding="md" style={{ backgroundColor: "#F5F5F5" }}>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default StudentToSectionAllocation;
