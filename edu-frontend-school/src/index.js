import "./index.css";
import App from "./App";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { createRoot } from "react-dom/client";
import { MantineProvider, Container } from "@mantine/core";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ScreenshotRestrictor from "./Middleware/ScreenshotRestrictor";
const root = document.getElementById("root");
const reactRoot = createRoot(root);

reactRoot.render(
  <AuthProvider>
    <MantineProvider>
      <Container size="xs">
        <Router>
          {/* <ScreenshotRestrictor> */}
          <App />
          {/* </ScreenshotRestrictor> */}
        </Router>
      </Container>
    </MantineProvider>
  </AuthProvider>
);
