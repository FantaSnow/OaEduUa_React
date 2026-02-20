import type { ThemeOptions } from "@mui/material";

export const paletteLight: ThemeOptions["palette"] = {
  mode: "light",
  primary: {
    main: "#E0CDA5",
    primary5: "#FBF9F1",
    primary10: "#F5F0DF",
    primary20: "#E9DDBF",
    primary30: "#E0CDA5",
    primary40: "#CBA76C",
    primary50: "#C0904F",
    primary60: "#B37C43",
    primary70: "#956339",
    primary80: "#785034",
    primary90: "#62432C",
    primary100: "#342116",
  } as Record<string, string>,
  secondary: {
    main: "#424242",
    secondary5: "#FFFFFF",
    secondary10: "#F8F8F8",
    secondary20: "#E3E3E3",
    secondary30: "#C6C6C6",
    secondary40: "#AAAAAA",
    secondary50: "#8E8E8E",
    secondary60: "#717171",
    secondary70: "#555555",
    secondary80: "#393939",
    secondary90: "#1C1C1C",
    secondary100: "#000000",
  } as Record<string, string>,
  error: {
    main: "#F44336",
    success: "#00FF41",
    onError: "#FFFFFF",
  } as Record<string, string>,
  schedule: {
    main: "#E3E3E3",
    Lab: "#E2B4FF",
    Prac: "#B2D8FF",
    lecture: "#9BF4B6",
  } as Record<string, string>,
  background: {
    default: "#fff",
    paper: "#fff",
  },
  text: {
    primary: "#342116",
    secondary: "#593D2A",
  },
};
