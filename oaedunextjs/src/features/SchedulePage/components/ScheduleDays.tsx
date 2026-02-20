import React from "react";
import type { Theme } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";
import { weekDays } from "../constants";
import { formatDate } from "../utils/schedule";

interface ScheduleDaysProps {
  weekDates: Date[];
  activeDay: number;
  setActiveDay: (idx: number) => void;
  theme: Theme;
}

const ScheduleDays: React.FC<ScheduleDaysProps> = ({
  weekDates,
  activeDay,
  setActiveDay,
  theme,
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      mb: 3,
    }}
  >
    <Box
      sx={{
        display: "flex",
        bgcolor: "secondary.secondary20",
        borderRadius: "18px",
        boxShadow: "0px 4px 5px 2px #00000024",
        px: 2,
        py: 1,
        width: "100%",
        maxWidth: 1100,
        alignItems: "center",
        gap: 1,
      }}
    >
      {weekDates.map((date, idx) => (
        <Button
          key={idx}
          onClick={() => setActiveDay(idx)}
          disableRipple
          sx={{
            flex: 1,
            borderRadius: "10px",
            background:
              idx === activeDay
                ? theme.palette.secondary.secondary30
                : "transparent",
            color: "text.primary",
            transition: "background 0.2s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              background: theme.palette.secondary.secondary40,
            },
          }}
        >
          <Typography variant="body2" color="text.primary">
            {weekDays[idx]}
          </Typography>
          <Typography variant="body2" color="text.primary">
            {formatDate(date)}
          </Typography>
        </Button>
      ))}
    </Box>
  </Box>
);

export default ScheduleDays;
