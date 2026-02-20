import type { ThemeOptions } from "@mui/material";

export const paginationOverrides: ThemeOptions["components"] = {
  MuiPaginationItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        minWidth: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: theme.palette.primary.primary30,
        color: "text.primary",
        fontSize: "18px",
        lineHeight: "132%",
        fontWeight: 300,
        fontFamily: "'Poppins', sans-serif",
        textTransform: "none",
        margin: "0 4px",
        "&.Mui-selected": {
          backgroundColor: theme.palette.primary.primary50,
        },
        "&:hover": {
          backgroundColor: theme.palette.primary.primary40,
        },
      }),
    },
  },
};
