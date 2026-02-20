"use client";
import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";

type Review = {
  text: string;
  author: string;
  role: string;
};

interface ReviewSliderProps {
  reviews: Review[];
}

const ReviewSlider: React.FC<ReviewSliderProps> = ({ reviews }) => {
  const [activeReview, setActiveReview] = useState(0);
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        margin: "40px 0px 190px 0px",
      }}
    >
      <Box
        sx={{
          width: { xs: "90vw", md: "60vw" },
          height: "232px",
          bgcolor: "secondary.secondary10",
          borderRadius: "28px",
          boxShadow: `0px 0px 30px -3px ${theme.palette.secondary?.secondary40 ?? "#AAAAAA"}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          p: 4,
        }}
      >
        <Typography
          variant="h3"
          color="text.primary"
          sx={{ textAlign: "center", mb: 3 }}
        >
          {reviews[activeReview].text}
        </Typography>
        <Typography
          variant="h4"
          color="text.primary"
          sx={{ textAlign: "center" }}
        >
          {reviews[activeReview].author}
        </Typography>
        <Typography
          variant="bodyM"
          color="text.primary"
          sx={{ textAlign: "center", mb: 2 }}
        >
          {reviews[activeReview].role}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
            cursor: "pointer",
          }}
        >
          {reviews.map((_, i) => (
            <Box
              key={i}
              onClick={() => setActiveReview(i)}
              sx={{
                width: i === activeReview ? "40px" : "30px",
                height: "4px",
                borderRadius: "2px",
                bgcolor:
                  i === activeReview
                    ? "secondary.secondary80"
                    : "secondary.secondary60",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ReviewSlider;

