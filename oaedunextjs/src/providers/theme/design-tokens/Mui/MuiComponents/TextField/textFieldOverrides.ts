import type { ThemeOptions } from "@mui/material/styles";

export const textFieldOverrides: ThemeOptions["components"] = {
  MuiTextField: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 12,
        "& .MuiOutlinedInput-root": {
          background: theme.palette.secondary.secondary10,
          color: theme.palette.text.primary,
          borderRadius: 12,
          "& fieldset": {
            borderColor: theme.palette.primary.primary30,
          },
          "&:hover fieldset": {
            borderColor: theme.palette.primary.primary20,
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.primary40,
          },
        },
      }),
    },
  },
};
