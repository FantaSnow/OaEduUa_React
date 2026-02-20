import type { ThemeOptions } from "@mui/material";

export const buttonOverrides: ThemeOptions["components"] = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        textTransform: "none",
        fontWeight: 600,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        flexShrink: 0,
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
        "&:active": {
          boxShadow: "none",
        },
      },
    },
    variants: [
      {
        props: { size: "medium", variant: "contained", color: "primary" },
        style: ({ theme }) => ({
          width: 150,
          height: 40,
          backgroundColor: theme.palette.primary.primary30,
          color: theme.palette.text.primary,
          "&:hover": {
            backgroundColor: theme.palette.primary.primary40,
          },
          "&:active": {
            backgroundColor: theme.palette.primary.primary50,
          },
          "&.Mui-disabled": {
            backgroundColor: theme.palette.primary.primary10,
          },
        }),
      },
      {
        props: { size: "medium", variant: "outlined", color: "primary" },
        style: ({ theme }) => ({
          width: 150,
          height: 40,
          backgroundColor: "transparent",
          color: theme.palette.text.primary,
          border: `1.5px solid ${theme.palette.primary.primary30}`,
          "&:hover": {
            border: `1.5px solid ${theme.palette.primary.primary40}`,
          },
          "&:active": {
            border: `1.5px solid ${theme.palette.primary.primary50}`,
          },
          "&.Mui-disabled": {
            border: `1.5px solid ${theme.palette.primary.primary10}`,
          },
        }),
      },
      {
        props: { size: "medium", variant: "text", color: "primary" },
        style: ({ theme }) => ({
          width: 150,
          height: 40,
          backgroundColor: "transparent",
          color: theme.palette.text.primary,
        }),
      },
      {
        props: { size: "large", variant: "contained", color: "primary" },
        style: ({ theme }) => ({
          width: 200,
          height: 40,
          backgroundColor: theme.palette.primary.primary30,
          color: theme.palette.text.primary,
          "&:hover": {
            backgroundColor: theme.palette.primary.primary40,
          },
          "&:active": {
            backgroundColor: theme.palette.primary.primary50,
          },
          "&.Mui-disabled": {
            backgroundColor: theme.palette.primary.primary10,
          },
        }),
      },
      {
        props: { size: "large", variant: "outlined", color: "primary" },
        style: ({ theme }) => ({
          width: 200,
          height: 40,
          backgroundColor: "transparent",
          color: theme.palette.text.primary,
          border: `1.5px solid ${theme.palette.primary.primary30}`,
          "&:hover": {
            border: `1.5px solid ${theme.palette.primary.primary40}`,
          },
          "&:active": {
            border: `1.5px solid ${theme.palette.primary.primary50}`,
          },
          "&.Mui-disabled": {
            border: `1.5px solid ${theme.palette.primary.primary10}`,
          },
        }),
      },
      {
        props: { size: "large", variant: "text", color: "primary" },
        style: ({ theme }) => ({
          width: 200,
          height: 40,
          backgroundColor: "transparent",
          color: theme.palette.text.primary,
        }),
      },
      {
        props: { size: "small", variant: "contained", color: "primary" },
        style: ({ theme }) => ({
          width: 44,
          height: 40,
          backgroundColor: theme.palette.primary.primary30,
          color: theme.palette.text.primary,
          "&:hover": {
            backgroundColor: theme.palette.primary.primary40,
          },
          "&:active": {
            backgroundColor: theme.palette.primary.primary50,
          },
          "&.Mui-disabled": {
            backgroundColor: theme.palette.primary.primary10,
          },
        }),
      },
    ],
  },
};
