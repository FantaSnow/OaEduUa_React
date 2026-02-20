import "@mui/material/Typography";

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    bodyS: true;
    bodyM: true;
    bodyL: true;
    buttonL: true;
    buttonM: true;
    buttonS: true;
  }
}
