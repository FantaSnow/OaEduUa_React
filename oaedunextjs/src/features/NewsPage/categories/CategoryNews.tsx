"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter, useParams } from "next/navigation";
import NewsService from "@/api/services/NewsService";
import type { NewsEntity } from "@/types/entities";
import { unwrapApiResponse } from "@/types/api.types";

const NO_PHOTO_URL = "/assets/images/NoPhoto.jpg";
const MANY_NEWS_THRESHOLD = 7;
const SMALL_ROW_COUNT = 5;

const CategoryNews: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams<{ category?: string }>();
  const categoryParam = decodeURIComponent(params.category ?? "");

  const [news, setNews] = useState<NewsEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryParam) return;

    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await NewsService.getAll(0, 200);
        const items = unwrapApiResponse(resp) ?? [];
        const filtered = items.filter(
          (n) => n.newscategory?.name === categoryParam
        );
        const sorted = [...filtered].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        setNews(sorted);
      } catch {
        setError("Не вдалося завантажити новини");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [categoryParam]);

  const { topNews, smallNews, listNews } = useMemo(() => {
    if (!news.length) {
      return {
        topNews: null as NewsEntity | null,
        smallNews: [] as NewsEntity[],
        listNews: [] as NewsEntity[],
      };
    }

    const [first, ...rest] = news;
    if (news.length >= MANY_NEWS_THRESHOLD) {
      const small = rest.slice(0, SMALL_ROW_COUNT);
      const list = rest.slice(SMALL_ROW_COUNT);
      return { topNews: first, smallNews: small, listNews: list };
    }

    return { topNews: first, smallNews: [] as NewsEntity[], listNews: rest };
  }, [news]);

  if (!categoryParam) {
    return null;
  }

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          py: 4,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!topNews) {
    return (
      <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", py: 4 }}>
        <Typography variant="bodyM" color="text.primary">
          Новин цієї категорії поки немає.
        </Typography>
      </Box>
    );
  }

  const getImage = () => NO_PHOTO_URL;

  const handleOpenDetails = (item: NewsEntity) => {
    const image = NO_PHOTO_URL;
    const title = item.name ?? "";
    const description = item.description ?? "";
    const meta = item.created_at ?? "";
    const faculty = item.department?.name ?? "";

    const search = new URLSearchParams();
    search.set("image", image);
    search.set("title", title);
    search.set("description", description);
    if (meta) search.set("meta", meta);
    if (faculty) search.set("faculty", faculty);

    router.push(
      `/news/${encodeURIComponent(categoryParam)}/${item.id}?${search.toString()}`
    );
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", py: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ flex: 2, borderRadius: 3, overflow: "hidden" }}>
          <img
            src={getImage()}
            alt={topNews.name}
            style={{
              width: "100%",
              height: 374,
              objectFit: "cover",
              borderRadius: 16,
            }}
          />
        </Box>
        <Box
          sx={{
            flex: 1.2,
            bgcolor: "secondary.secondary20",
            borderRadius: 3,
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h3"
            color="text.primary"
            gutterBottom
            sx={{
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {topNews.name}
          </Typography>
          <Typography
            variant="bodyS"
            color="text.primary"
            sx={{
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 7,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {topNews.description}
          </Typography>
          <Button
            variant="text"
            sx={{
              alignSelf: "flex-start",
              px: 0,
              color: theme.palette.text.primary,
              ...theme.typography.h4,
            }}
            onClick={() => handleOpenDetails(topNews)}
          >
            Читати більше
          </Button>
        </Box>
      </Box>

      {!!smallNews.length && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
          }}
        >
          {smallNews.map((item) => (
            <Box
              key={item.id}
              sx={{
                textAlign: "left",
                width: { xs: "100%", sm: "48%", md: "18%" },
                cursor: "pointer",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: "box-shadow 0.2s, background 0.2s",
                "&:hover": {
                  "& .small-news-title": {
                    textDecoration: "underline",
                  },
                },
              }}
              onClick={() => handleOpenDetails(item)}
            >
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 1,
                  height: 120,
                  width: "100%",
                }}
              >
                <img
                  src={getImage()}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </Box>
              <Typography
                variant="bodyS"
                color="text.primary"
                className="small-news-title"
                sx={{ transition: "text-decoration 0.2s" }}
              >
                {item.name}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {listNews.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 3,
            p: 3,
            bgcolor: "secondary.secondary10",
            alignItems: "flex-start",
            cursor: "pointer",
            boxShadow: 1,
            borderRadius: 3,
            "&:hover": { boxShadow: 6, background: theme.palette.action.hover },
          }}
          onClick={() => handleOpenDetails(item)}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "40%" },
              minWidth: 220,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <img
              src={getImage()}
              alt={item.name}
              style={{
                width: "100%",
                height: 245,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </Box>
          <Box sx={{ flex: 1, flexDirection: "column", display: "flex" }}>
            <Typography
              variant="bodyM"
              color="text.primary"
              gutterBottom
              noWrap
              sx={{ mt: 1.5 }}
            >
              {item.name}
            </Typography>
            <Typography
              variant="bodyS"
              color="text.primary"
              sx={{
                mb: 1,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.description}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CategoryNews;

