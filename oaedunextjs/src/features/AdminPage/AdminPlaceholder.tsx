"use client";

import { Box, Typography } from "@mui/material";

interface AdminPlaceholderProps {
  title: string;
}

export default function AdminPlaceholder({ title }: AdminPlaceholderProps) {
  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h5" color="text.primary">
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Цей розділ буде доступний після повної міграції.
      </Typography>
    </Box>
  );
}
