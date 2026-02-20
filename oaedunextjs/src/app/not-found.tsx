"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import NotFoundIcon from "@/assets/icons/404.svg";
import { getPaletteCssVars } from "@/lib/getPaletteCssVars";
import { paletteLight } from "@/providers/theme/design-tokens/Mui/Palette/paletteLight";

export default function NotFound() {
  const router = useRouter();
  const iconColors = getPaletteCssVars(
    paletteLight?.primary as Record<string, string>
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        bgcolor: "primary.primary30",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        minHeight: "500px",
      }}
    >
      {/* Основний блок */}
      <Box
        sx={{
          width: { xs: 340, md: 420 },
          height: { xs: 340, md: 420 },
          bgcolor: "primary.primary90",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          p: { xs: 3, md: 5 },
          gap: 0,
        }}
      >
        {/* Заголовок */}
        <Typography
          color="primary.primary30"
          sx={{
            fontSize: { xs: 36, md: 48 },
            fontWeight: 700,
            fontFamily: "'poppins', sans-serif",
            lineHeight: { xs: "40px", md: "52px" },
            letterSpacing: 0,
            textAlign: "left",
          }}
        >
          СТОРІНКА
          <br />
          НЕ ПРАЦЮЄ
        </Typography>
        {/* Пояснення */}
        <Typography
          color="primary.primary30"
          sx={{
            textAlign: "left",
            fontSize: { xs: 15, md: 18 },
            fontWeight: 700,
            fontFamily: "'poppins', sans-serif",
            lineHeight: { xs: "20px", md: "22px" },
          }}
        >
          Ми поки не знаємо в чому проблема, <br /> але скоро це пофіксимо
        </Typography>
        {/* 404 */}
        <Typography
          color="primary.primary30"
          sx={{
            width: "100%",
            flex: "1 1 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: { xs: 90, md: 120 },
            fontWeight: 700,
            fontFamily: "'poppins', sans-serif",
            lineHeight: 1,
            textAlign: "center",
            overflow: "hidden",
            userSelect: "none",
          }}
        >
          404
        </Typography>

        {/* Кнопка */}
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push("/HomePage")}
        >
          окак , на головну
        </Button>
      </Box>
      <Box
        sx={{
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: { xs: "0", lg: 720 },
          display: "flex",
          mx: "52px",
        }}
      >
        <NotFoundIcon
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            ...iconColors,
          }}
        />
      </Box>
    </Box>
  );
}
