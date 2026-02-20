"use client";

import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loader: React.FC = () => (
  <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
    <CircularProgress />
  </Box>
);

export default Loader;
