import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteColor {
    [key: string]: string | undefined;
    primary5?: string;
    primary10?: string;
    primary20?: string;
    primary30?: string;
    primary40?: string;
    primary50?: string;
    primary60?: string;
    primary70?: string;
    primary80?: string;
    primary90?: string;
    primary100?: string;
    secondary5?: string;
    secondary10?: string;
    secondary20?: string;
    secondary30?: string;
    secondary40?: string;
    secondary50?: string;
    secondary60?: string;
    secondary70?: string;
    secondary80?: string;
    secondary90?: string;
    secondary100?: string;
    success?: string;
    onError?: string;
  }
  interface SimplePaletteColorOptions {
    [key: string]: string | undefined;
    primary5?: string;
    primary10?: string;
    primary20?: string;
    primary30?: string;
    primary40?: string;
    primary50?: string;
    primary60?: string;
    primary70?: string;
    primary80?: string;
    primary90?: string;
    primary100?: string;
    secondary5?: string;
    secondary10?: string;
    secondary20?: string;
    secondary30?: string;
    secondary40?: string;
    secondary50?: string;
    secondary60?: string;
    secondary70?: string;
    secondary80?: string;
    secondary90?: string;
    secondary100?: string;
    success?: string;
    onError?: string;
  }
  interface Palette {
    schedule?: {
      main: string;
      Lab?: string;
      Prac?: string;
      lecture?: string;
    };
  }
  interface PaletteOptions {
    schedule?: {
      main?: string;
      Lab?: string;
      Prac?: string;
      lecture?: string;
    };
  }
}
