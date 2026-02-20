import React from "react";
import Box from "@mui/material/Box";
import Header from "@/components/layouts/AdminLayoutHeader";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
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
    </Box>
  );
};

export default AdminLayout;

