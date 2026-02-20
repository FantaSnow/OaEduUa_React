import type { ThemeOptions } from "@mui/material";

export const toolBarOverrides: ThemeOptions["components"] = {
  MuiToolbar: {
    styleOverrides: {
      root: {
        height: 88,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      },
    },
  },
};
