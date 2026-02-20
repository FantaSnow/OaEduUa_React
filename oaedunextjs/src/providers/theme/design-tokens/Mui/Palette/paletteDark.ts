import type { ThemeOptions } from "@mui/material";

export const paletteDark: ThemeOptions["palette"] = {
  mode: "dark",
  primary: {
    main: "#6B432A",
    primary5: "#342116",
    primary10: "#62432C",
    primary20: "#785034",
    primary30: "#956339",
    primary40: "#B37C43",
    primary50: "#C0904F",
    primary60: "#CBA76C",
    primary70: "#E0CDA5",
    primary80: "#E9DDBF",
    primary90: "#E9DDBF",
    primary100: "#FBF9F1",
  } as Record<string, string>,
  secondary: {
    main: "#424242",
    secondary5: "#000000",
    secondary10: "#1C1C1C",
    secondary20: "#393939",
    secondary30: "#555555",
    secondary40: "#717171",
    secondary50: "#8E8E8E",
    secondary60: "#AAAAAA",
    secondary70: "#C6C6C6",
    secondary80: "#E3E3E3",
    secondary90: "#F8F8F8",
    secondary100: "#FFFFFF",
  } as Record<string, string>,
  error: {
    main: "#F44336",
    success: "#00FF41",
    onError: "#FFFFFF",
  } as Record<string, string>,
  schedule: {
    main: "#393939",
    Lab: "#AD1CA3",
    Prac: "#1C7CCA",
    lecture: "#169D2A",
  } as Record<string, string>,
  background: {
    default: "#181c1f",
    paper: "#23272b",
  },
  text: {
    primary: "#EFEAD2",
    secondary: "#E1D5A7",
  },
};
