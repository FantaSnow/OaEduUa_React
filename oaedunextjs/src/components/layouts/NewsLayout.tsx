import React from "react";
import Box from "@mui/material/Box";
import Header from "@/components/layouts/NewsLayoutHeader";

interface NewsLayoutProps {
  children?: React.ReactNode;
}

const NewsLayout: React.FC<NewsLayoutProps> = ({ children }) => {
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

export default NewsLayout;

