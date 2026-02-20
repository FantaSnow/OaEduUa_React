import type { ThemeOptions } from "@mui/material";
import { buttonOverrides } from "./Mui/MuiComponents/Button/buttonOverrides";
import { appBarOverrides } from "./Mui/MuiComponents/AppBar/appBarOverrides";
import { typography } from "./Mui/Typography/typography";
import { toolBarOverrides } from "./Mui/MuiComponents/ToolBar/toolBarOverrides";
import { paletteDark } from "./Mui/Palette/paletteDark";
import { navLinkOverrides } from "./Mui/MuiComponents/NavLink/navLinkOverrides";
import { textFieldOverrides } from "./Mui/MuiComponents/TextField/textFieldOverrides";
import { paginationOverrides } from "./Mui/MuiComponents/Pagination/paginationOverrides";

export const darkThemeToken: ThemeOptions = {
  palette: paletteDark,
  typography,
  components: {
    ...buttonOverrides,
    ...appBarOverrides,
    ...toolBarOverrides,
    ...navLinkOverrides,
    ...textFieldOverrides,
    ...paginationOverrides,
  },
};
