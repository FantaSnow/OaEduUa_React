import React from "react";
import Box from "@mui/material/Box";
import Header from "@/components/layouts/MainLayoutHeader";
import Footer from "@/components/layouts/MainLayoutFooter";

interface LayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
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
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </Box>
  );
};

export default MainLayout;

