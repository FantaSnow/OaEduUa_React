"use client";

import { Box, Typography, Stack } from "@mui/material";
import { TelegramIcon, GoogleIcon, SocialsIcon } from "@/components/icons/FooterIcons";
import LogoF from "@/assets/icons/LogoF.svg";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        bgcolor: "primary.primary20",
        color: "text.primary",
        py: 4,
        px: { xs: 2, md: 8 },
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="h2"
          width={{ xs: "100%", lg: "40%" }}
          textAlign={{ xs: "center", lg: "left" }}
        >
          © 2025 OAEdu. Усі права захищено
        </Typography>

        <Box sx={{ my: { xs: 2, lg: 0 } }}>
          <LogoF style={{ color: "text.primary" }} />
        </Box>
        <Stack
          direction="column"
          spacing={3}
          alignItems={{ xs: "center", lg: "flex-end" }}
          width={{ xs: "100%", lg: "40%" }}
        >
          <Stack direction="row" spacing={1}>
            <Typography variant="h2">Telegram Bot</Typography>
            <TelegramIcon />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="h2">Social media</Typography>
            <GoogleIcon />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="h2">Application</Typography>
            <SocialsIcon />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Footer;
