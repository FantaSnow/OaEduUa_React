import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "secondary.secondary10",
      }}
    >
      <Header />
      <main style={{ flex: 1 }}>{children || <Outlet />}</main>
      <Footer />
    </Box>
  );
};

export default Layout;
