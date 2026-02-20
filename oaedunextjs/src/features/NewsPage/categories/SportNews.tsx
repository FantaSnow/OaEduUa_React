"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";

const topNews = {
  image:
    "https://www.oa.edu.ua/assets/images/n/2025/05/big/edelvika_visit_b.jpg",
  title: "Навчально-практична екскурсійна поїздка на ПрАТ «Едельвіка»",
  description:
    "23 травня успішно відбулася навчально-практична екскурсійна поїздка на ПрАТ «Едельвіка» – зразкове підприємство легкої промисловості України, багаторічного стейкхолдера Острозької академії.",
};

const smallNews = [
  {
    image: "https://www.oa.edu.ua/assets/images/new_building_b.jpg",
    title:
      "Національний університет «Острозька академія» долучився до Експериментального проекту щодо надання державної допомоги на навчання дітям деяких категорій осіб, які захищали незалежність, суверенітет та територіальну цілісність України",
  },
  {
    image:
      "https://www.oa.edu.ua/assets/images/n/2025/05/big/ivaschuk_senegal_b.jpg",
    title:
      "До Дня Африки в Острозькій академії відбулася зустріч з Почесним консулом Республіки Сенегал",
  },
  {
    image: "https://www.oa.edu.ua/assets/images/n/2025/05/big/ishm_week_b.jpg",
    title:
      "В Острозькій академії відсвяткували тиждень Інституту соціально-гуманітарного менеджменту",
  },
  {
    image:
      "https://www.oa.edu.ua/assets/images/n/2025/05/big/ufu_idud_conf_b.jpg",
    title:
      "Міжнародна наукова конференція «Проблеми культурної ідентичності в ситуації сучасного діалогу культур»",
  },
  {
    image:
      "https://www.oa.edu.ua/assets/images/n/2025/05/big/mental_health_week_b.jpg",
    title: "Тиждень обізнаності про ментальне здоров'я в Острозькій академії",
  },
];

const listNews = [
  {
    image:
      "https://www.oa.edu.ua/assets/images/n/2025/05/big/shoi_alumni_b.jpg",
    title: "П'ятий випуск Школи освітніх інновацій в Острозькій академії",
    description:
      "22 травня в Навчально-методичному центрі «Школа освітніх інновацій» Національного університету «Острозька академія» відбулося урочисте вручення сертифікатів про підвищення кваліфікації у викладачів вишу.",
    meta: "22.05.2025",
  },
  {
    image:
      "https://www.oa.edu.ua/assets/images/n/2025/05/big/maryna_kobylynska_b.jpg",
    title:
      "В Острозькій академії презентували Молодіжну раду при Міністерстві аграрної політики та продовольства",
    description:
      "22 травня в Національному університеті «Острозька академія» відбулася зустріч студентів навчально-наукового інституту соціально-гуманітарного менеджменту й навчально-наукового інституту лінгвістики з координаторкою Молодіжної ради при Міністерстві аграрної політики та продовольства Мариною Кобилинською.",
    meta: "22.05.2025",
  },
  {
    image:
      "https://www.oa.edu.ua/assets/images/n/2025/05/big/anons_amu_exchange_program_b.jpg",
    title:
      "Конкурс на семестрове навчання в Університеті ім. Адама Міцкевича (Республіка Польща)",
    description:
      "У межах двосторонньої Угоди про співпрацю Університет ім. Адама Міцкевича та Національний університет «Острозька академія» оголошують конкурс на здійснення семестрової навчальної мобільності у зимовому семестрі 2025-2026 н.р.",
    meta: "22.05.2025",
  },
];

const CATEGORY = "sport";

const SportNews: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", py: 3 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Box sx={{ flex: 2, borderRadius: 3, overflow: "hidden" }}>
          <img
            src={topNews.image}
            alt="main"
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
          <Typography variant="h3" color="text.primary" gutterBottom sx={{ mb: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
            {topNews.title}
          </Typography>
          <Typography variant="bodyS" color="text.primary" sx={{ mb: 2, display: "-webkit-box", WebkitLineClamp: 7, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
            {topNews.description}
          </Typography>
          <Button
            variant="text"
            sx={{ alignSelf: "flex-start", px: 0, color: theme.palette.text.primary, ...theme.typography.h4 }}
            onClick={() =>
              router.push(
                `/news/${CATEGORY}/top?image=${encodeURIComponent(topNews.image)}&title=${encodeURIComponent(topNews.title)}&description=${encodeURIComponent(topNews.description)}`
              )
            }
          >
            Читати більше
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mb: 4 }}>
        {smallNews.map((news, i) => (
          <Box
            key={i}
            sx={{
              textAlign: "left",
              width: "19%",
              cursor: "pointer",
              "&:hover": { "& .small-news-title": { textDecoration: "underline" } },
            }}
            onClick={() =>
              router.push(
                `/news/${CATEGORY}/small-${i}?image=${encodeURIComponent(news.image)}&title=${encodeURIComponent(news.title)}`
              )
            }
          >
            <Box sx={{ borderRadius: 2, overflow: "hidden", mb: 1, height: 120, width: "100%" }}>
              <img src={news.image} alt={`news-${i}`} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
            </Box>
            <Typography variant="bodyS" color="text.primary" className="small-news-title">
              {news.title}
            </Typography>
          </Box>
        ))}
      </Box>
      {listNews.map((news, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
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
          onClick={() =>
            router.push(
              `/news/${CATEGORY}/${i}?image=${encodeURIComponent(news.image)}&title=${encodeURIComponent(news.title)}&description=${encodeURIComponent(news.description)}&meta=${encodeURIComponent(news.meta)}`
            )
          }
        >
          <Box sx={{ width: "40%", minWidth: 220, borderRadius: 2, overflow: "hidden" }}>
            <img src={news.image} alt={`list-news-${i}`} style={{ width: "100%", height: 245, objectFit: "cover", borderRadius: 8 }} />
          </Box>
          <Box sx={{ flex: 1, flexDirection: "column", display: "flex" }}>
            <Typography variant="bodyM" color="text.primary" gutterBottom noWrap sx={{ mt: 1.5 }}>
              {news.title}
            </Typography>
            <Typography variant="bodyS" color="text.primary" sx={{ mb: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
              {news.description}
            </Typography>
            <Typography variant="caption" color="text.primary">
              {news.meta}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default SportNews;
