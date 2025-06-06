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
import { useNavigate } from "react-router-dom";
import volunteerImg from "../../assets/icons/NoPhoto.jpg";

const volunteeringList = [
  {
    id: 1,
    title: "Допоможіть організувати благодійний ярмарок для підтримки ЗСУ",
    image: volunteerImg,
    org: "Благодійний фонд 'Відкриті Серця'",
    orgLogo: volunteerImg,
  },
  {
    id: 2,
    title: "Волонтер у притулку для тварин “Друзі”",
    image: volunteerImg,
    org: "Притулок 'Друзі'",
    orgLogo: volunteerImg,
  },
  {
    id: 3,
    title: "Проведення майстер-класів для дітей у лікарні",
    image: volunteerImg,
    org: "ГО 'Щасливе дитинство'",
    orgLogo: volunteerImg,
  },
  {
    id: 4,
    title: "Допомога в організації ІТ-конференції для школярів",
    image: volunteerImg,
    org: "IT Step Academy",
    orgLogo: volunteerImg,
  },
  {
    id: 5,
    title: "Сортування та пакування гуманітарної допомоги",
    image: volunteerImg,
    org: "Волонтерський центр “Разом”",
    orgLogo: volunteerImg,
  },
  {
    id: 6,
    title: "Підтримка літніх людей: доставка продуктів та ліків",
    image: volunteerImg,
    org: "Червоний Хрест",
    orgLogo: volunteerImg,
  },
  {
    id: 7,
    title: "Організація екологічної акції “Чисте місто”",
    image: volunteerImg,
    org: "Еко-ініціатива",
    orgLogo: volunteerImg,
  },
  {
    id: 8,
    title: "Волонтерство на фестивалі сучасної музики",
    image: volunteerImg,
    org: "Молодіжний центр",
    orgLogo: volunteerImg,
  },
];

const categories = ["Всі", "Організація", "Допомога", "ІТ", "Інше"];

const VolunteeringPage: React.FC = () => {
  const navigate = useNavigate();
  // Стан для фільтрів
  const [category, setCategory] = useState("Всі");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Фільтрація
  const filtered = volunteeringList.filter(
    (v) =>
      (category === "Всі" || v.org === category) &&
      v.title.toLowerCase().includes(search.toLowerCase())
  );

  // Пагінація
  const perPage = 6;
  const pageCount = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <Box sx={{ px: 12, py: 10, minHeight: "100vh" }}>
      <Typography variant="h1" color="text.primary" sx={{ mb: 3 }}>
        3 Можливості
      </Typography>
      <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
        {/* Ліва колонка: список волонтерств */}
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
              onClick={() => navigate(`/volunteering/${v.id}`, { state: v })}
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
          {/* Пагінація */}
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
        {/* Права колонка: фільтри */}
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
          {/* Додаткові фільтри можна додати тут */}
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
