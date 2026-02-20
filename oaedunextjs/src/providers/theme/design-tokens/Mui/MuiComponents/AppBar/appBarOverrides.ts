import type { ThemeOptions } from "@mui/material";

export const appBarOverrides: ThemeOptions["components"] = {
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        display: "flex",
        width: "100%",
        height: 88,
        padding: "0px",
        alignItems: "center",
        backgroundColor: theme.palette.primary.primary20,
        boxShadow: "0px 2px 2px 2px #00000040",
      }),
    },
  },
};
