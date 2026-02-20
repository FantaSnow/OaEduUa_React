import type { ThemeOptions } from "@mui/material";

export const navLinkOverrides: ThemeOptions["components"] = {
  MuiLink: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.primary,
        textDecoration: "none",
        cursor: "pointer",
      }),
    },
  },
};
