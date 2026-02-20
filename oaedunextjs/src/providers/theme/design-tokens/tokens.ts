import { createTheme } from "@mui/material/styles";
import { lightThemeToken } from "./light-theme-tokens";
import { darkThemeToken } from "./dark-theme-tokens";

const lightTheme = createTheme(lightThemeToken);
const darkTheme = createTheme(darkThemeToken);

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

