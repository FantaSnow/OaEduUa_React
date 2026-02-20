"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";

interface NewsDetailsProps {
  image?: string;
  title?: string;
  description?: string;
  meta?: string;
  faculty?: string;
  date?: string;
  content?: string;
  chatImage?: string;
}

const NewsDetails: React.FC<NewsDetailsProps> = (props) => {
  const router = useRouter();
  const params = useSearchParams();

  const image = props.image ?? params.get("image") ?? undefined;
  const title = props.title ?? params.get("title") ?? undefined;
  const description = props.description ?? params.get("description") ?? undefined;
  const content = props.content ?? params.get("content") ?? undefined;
  const meta = props.meta ?? params.get("meta") ?? undefined;
  const faculty = props.faculty ?? params.get("faculty") ?? undefined;
  const chatImage = props.chatImage ?? params.get("chatImage") ?? undefined;

  if (!title) {
    router.back();
    return null;
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 4, position: "relative" }}>
      <Typography variant="h1" color="text.primary" sx={{ mb: 2 }}>
        {title}
      </Typography>

      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        mb={3}
      >
        <Box display={"flex"} flexDirection={"column"}>
          <Typography variant="h3" color="text.primary">
            {faculty || "Economy faculty"}
          </Typography>
          <Typography
            variant="bodyM"
            color="text.primary"
            sx={{ mb: 2, display: "block" }}
          >
            {meta || "Fri, May 23, 2025 at 11:23 PM GMT+3 · 3 min read"}
          </Typography>
        </Box>
        <Box display={"flex"} alignItems={"center"}>
          <Button
            sx={{
              position: "relative",
              right: 0,
              zIndex: 2,
            }}
            onClick={() => router.back()}
            variant="outlined"
          >
            Назад
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          bgcolor: "primary.primary20",
          borderRadius: 4,
          mb: 2,
          minHeight: 460,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {(image || chatImage) && (
          <img
            src={chatImage || image}
            alt={title}
            style={{
              width: "100%",
              height: 460,
              objectFit: "cover",
              borderRadius: 12,
              display: "block",
            }}
          />
        )}
      </Box>

      <Box
        sx={{
          p: 2,
          mb: 5,
        }}
      >
        <Typography
          variant="bodyL"
          color="text.primary"
          sx={{ whiteSpace: "pre-line" }}
        >
          {description || content || "Тут буде текст новини..."}
        </Typography>
      </Box>
    </Box>
  );
};

export default NewsDetails;

