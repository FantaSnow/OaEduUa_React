import type { PaletteColor } from "@mui/material/styles";

export function getPaletteCssVars(
  palette?: PaletteColor | Record<string, string>
) {
  if (!palette || typeof palette !== "object") return {};
  const entries = Object.entries(palette).filter(
    ([, v]) => typeof v === "string"
  );
  return Object.fromEntries(
    entries.map(([key, value]) => [`--primary-${key}`, value])
  );
}
