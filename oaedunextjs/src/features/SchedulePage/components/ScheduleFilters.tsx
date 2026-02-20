import React from "react";
import type { Theme } from "@mui/material/styles";
import { Box, Checkbox, Typography } from "@mui/material";
import { tableHeaders } from "../constants";

interface ScheduleFiltersProps {
  activeColumns: string[];
  handleToggleColumn: (key: string) => void;
  theme: Theme;
}

const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
  activeColumns,
  handleToggleColumn,
  theme,
}) => (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
    <Box
      sx={{
        display: "flex",
        gap: 3,
        bgcolor: "secondary.secondary10",
        p: 2,
        borderRadius: 3,
        boxShadow: "0px 4px 5px 2px #00000024",
        minWidth: 400,
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {tableHeaders.map((header) => (
        <Box key={header.key} sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={activeColumns.includes(header.key)}
            onChange={() => handleToggleColumn(header.key)}
            size="small"
            sx={{
              color: theme.palette.primary.primary50,
              "&.Mui-checked": {
                color: theme.palette.primary.primary50,
              },
            }}
          />
          <Typography variant="body2" color="text.primary">
            {header.label}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

export default ScheduleFilters;
