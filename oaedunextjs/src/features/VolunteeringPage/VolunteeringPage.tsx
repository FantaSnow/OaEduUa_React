"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import { useRouter } from "next/navigation";

const volunteeringList = [
  {
    id: "1",
    title: "Допоможіть організувати благодійний ярмарок для підтримки ЗСУ",
    image: "https://smr.gov.ua/images/news/Podii/2023/04/11/5.jpg",
    org: "Благодійний фонд 'Відкриті Серця'",
    orgLogo:
      "https://www.vidkrite-serce.dp.ua/wp-content/uploads/open-heart.png.pagespeed.ce.ls5gKTCNkh.png",
  },
  {
    id: "2",
    title: "Волонтер у притулку для тварин “Друзі”",
    image:
      "https://news.sumdu.edu.ua/images/news/2022/2022-09-30/1/photo_2022-09-29_14-05-15.jpg",
    org: "Притулок 'Друзі'",
    orgLogo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxYNzdEnSXYkRIDv7DiMl1sjlmxon6aAst_w&s",
  },
  {
    id: "3",
    title: "Проведення майстер-класів для дітей у лікарні",
    image: "https://t1.ua/photos/articles/2021/03/55545_1_1097.jpg",
    org: "ГО 'Щасливе дитинство'",
    orgLogo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmcoH8U3lO0aVdpmgewlHmJuV-ZIK4uHMY3g&s",
  },
];

const categories = ["Всі", "Організація", "Допомога", "ІТ", "Інше"];

const VolunteeringPage: React.FC = () => {
  const router = useRouter();
  const [category, setCategory] = useState("Всі");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = volunteeringList.filter(
    (v) =>
      (category === "Всі" || v.org === category) &&
      v.title.toLowerCase().includes(search.toLowerCase())
  );

  const perPage = 6;
  const pageCount = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <Box sx={{ px: 12, py: 10, minHeight: "100vh" }}>
      <Typography variant="h1" color="text.primary" sx={{ mb: 3 }}>
        3 Можливості
      </Typography>
      <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
        <Box sx={{ flex: 1 }}>
          {paginated.map((v) => (
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
                src={v.image}
                alt={v.title}
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
                  {v.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    component="img"
                    src={v.orgLogo}
                    alt={v.org}
                    sx={{ width: 32, height: 32, borderRadius: 2 }}
                  />
                  <Typography variant="h4" color="text.primary">
                    {v.org}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
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
              {categories.map((cat) => (
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
    </Box>
  );
};

export default VolunteeringPage;

