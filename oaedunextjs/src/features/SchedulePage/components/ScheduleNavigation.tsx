import React from "react";
import type { Theme } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";
import { formatDate } from "../utils/schedule";

interface ScheduleNavigationProps {
  weekDates: Date[];
  currentMonday: Date;
  setCurrentMonday: (date: Date) => void;
  setActiveDay: (idx: number) => void;
  theme: Theme;
}

const ScheduleNavigation: React.FC<ScheduleNavigationProps> = ({
  weekDates,
  currentMonday,
  setCurrentMonday,
  setActiveDay,
  theme,
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      mb: 3,
      mt: 10,
    }}
  >
    <Button
      variant="contained"
      size="small"
      sx={{ mx: 2, boxShadow: 0, minWidth: 40 }}
      onClick={() => {
        const prev = new Date(currentMonday);
        prev.setDate(currentMonday.getDate() - 7);
        setCurrentMonday(prev);
        setActiveDay(0);
      }}
    >
      {"<"}
    </Button>
    <Box
      sx={{
        px: 2,
        py: 1.5,
        bgcolor: "secondary.secondary20",
        borderRadius: 2,
        textAlign: "center",
        boxShadow: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="body2" color="text.primary">
        {formatDate(weekDates[0])} – {formatDate(weekDates[6])}
      </Typography>
    </Box>
    <Button
      variant="contained"
      size="small"
      sx={{ mx: 2, minWidth: 40, boxShadow: 0 }}
      onClick={() => {
        const next = new Date(currentMonday);
        next.setDate(currentMonday.getDate() + 7);
        setCurrentMonday(next);
        setActiveDay(0);
      }}
    >
      {">"}
    </Button>
  </Box>
);

export default ScheduleNavigation;
