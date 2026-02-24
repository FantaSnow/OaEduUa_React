"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import VolunteeringService from "@/api/services/VolunteeringService";
import VolunteeringCategoryService from "@/api/services/VolunteeringCategoryService";
import { unwrapApiResponse } from "@/types/api.types";
import type { VolunteeringEntity } from "@/types/entities";

const placeholderImg = "/assets/images/NoPhoto.jpg";

const VolunteeringPage: React.FC = () => {
  const router = useRouter();
  const [list, setList] = useState<VolunteeringEntity[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState("Всі");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      VolunteeringService.getAll(0, 200),
      VolunteeringCategoryService.getAll(0, 500),
    ])
      .then(([volData, catData]) => {
        if (!cancelled) {
          setList(unwrapApiResponse(volData));
          setCategories(unwrapApiResponse(catData) ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Не вдалося завантажити список");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryNames = useMemo(
    () => ["Всі", ...categories.map((c) => c.name).sort()],
    [categories]
  );

  const filtered = useMemo(() => {
    const selectedCat = category === "Всі" ? null : categories.find((c) => c.name === category);
    return list.filter(
      (v) =>
        (category === "Всі" ||
          v.volunteeringcategory?.name === category ||
          v.volunteeringcategory_id === selectedCat?.id) &&
        (v.name ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }, [list, category, categories, search]);

  const perPage = 6;
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <Box sx={{ px: 12, py: 10, minHeight: "100vh" }}>
      <Typography variant="h1" color="text.primary" sx={{ mb: 3 }}>
        Можливості волонтерства
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
          <Box sx={{ flex: 1 }}>
            {paginated.length === 0 ? (
              <Typography color="text.secondary">
                Немає оголошень волонтерства за обраними фільтрами.
              </Typography>
            ) : (
              paginated.map((v) => (
                <Paper
                  key={v.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    p: 2.5,
                    borderRadius: 4,
                    boxShadow: "0px 2px 8px #0001",
                    minHeight: 120,
                    gap: 2,
                    cursor: "pointer",
                  }}
                  onClick={() => router.push(`/volunteering/${v.id}`)}
                >
                  <Box
                    component="img"
                    src={placeholderImg}
                    alt={v.name}
                    sx={{
                      width: 110,
                      height: 110,
                      borderRadius: 3,
                      objectFit: "cover",
                      mr: 2,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h3"
                      color="text.primary"
                      sx={{
                        mb: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                      }}
                    >
                      {v.name}
                    </Typography>
                    {(v.volunteeringcategory?.name ??
                      categories.find((c) => c.id === v.volunteeringcategory_id)?.name) && (
                      <Typography variant="h4" color="text.secondary">
                        {v.volunteeringcategory?.name ??
                          categories.find((c) => c.id === v.volunteeringcategory_id)?.name}
                      </Typography>
                    )}
                    {v.location && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {v.location}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              ))
            )}
            {pageCount > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, val) => setPage(val)}
                  color="primary"
                  shape="rounded"
                  siblingCount={1}
                  boundaryCount={1}
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </Box>

          <Paper
            sx={{
              minWidth: 300,
              maxWidth: 340,
              p: 3,
              borderRadius: 4,
              boxShadow: "0px 2px 8px #0001",
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Категорія</InputLabel>
              <Select
                value={category}
                label="Категорія"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categoryNames.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Пошук"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: "#E9DAB0",
                color: "#222",
                fontWeight: 600,
                mt: 1,
                borderRadius: 2,
                "&:hover": { bgcolor: "#CBB26A" },
              }}
              onClick={() => setPage(1)}
            >
              Шукати
            </Button>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default VolunteeringPage;
