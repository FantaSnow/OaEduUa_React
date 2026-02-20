"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import CardSlider, { type CardData } from "@/features/HomePage/CardSlider";
import ReviewSlider from "@/features/HomePage/ReviewSlider";

export interface Review {
  text: string;
  author: string;
  role: string;
}

const HomePage: React.FC = () => {
  const cards: CardData[] = [
    { name: "Строзюк Роман", role: "UX/UI дизайнер", img: "/assets/images/Roma.jpg" },
    { name: "Бурчак Петро", role: "DevOps інженер", img: "/assets/images/petya.jpg" },
    { name: "Нестерчук Віталій", role: "Мобільний розробник", img: "/assets/images/Edik.jpg" },
    { name: "Тарасюк Дмитро", role: "Фронтенд розробник", img: "/assets/images/Dmytro.jpg" },
    { name: "Довгий Данило", role: "Бекенд розробник", img: "/assets/images/Danya.jpg" },
    { name: "Качмарський Данило", role: "QA тестувальник", img: "/assets/images/DanyaK.jpg" },
  ];

  const reviews: Review[] = [
    { text: "Освіта — це не лише знання, а й натхнення змінювати світ на краще.", author: "Проф. Андрій Мельник", role: "декан факультету гуманітарних наук" },
    { text: "У стінах академії кожен студент — це майбутній лідер, якого ми допомагаємо розкрити.", author: "Олена Василенко", role: "доцент кафедри менеджменту" },
    { text: "Найбільша цінність університету — це люди, які тут навчаються і працюють.", author: "Віктор Гнатюк", role: "професор історії" },
    { text: "Ми не просто навчаємо — ми надихаємо на великі звершення.", author: "Світлана Ковальчук", role: "завідувачка кафедри філології" },
    { text: "Справжня освіта починається там, де закінчуються підручники.", author: "Ігор Тарасенко", role: "старший викладач інформатики" },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "secondary.secondary10",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          position: "relative",
          justifyContent: "center",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: "flex-start",
          mx: { xs: "10vw", lg: "5vw", xl: "10vw" },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", lg: "60%" },
            height: "100%",
            paddingTop: "40px",
          }}
        >
          <Typography variant="h1" color="text.primary">
            Острозька академія — твій старт у світ можливостей
          </Typography>
          <Typography variant="bodyL" color="text.primary" sx={{ mt: 4 }}>
            Вже понад 450 років Острозька академія поєднує глибокі традиції з
            сучасними підходами до освіти. Тут народжуються ідеї, що змінюють
            Україну та світ, а кожен студент отримує не лише знання, а й
            натхнення творити майбутнє.
          </Typography>
        </Box>
        <Box
          sx={{
            width: { xs: "100%", lg: "40%" },
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/assets/images/HomePage.png"
            style={{
              margin: "40px 0px",
              height: "300px",
              width: "auto",
              objectFit: "cover",
              display: "block",
            }}
            alt="HomePage"
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          margin: "40px 0px",
        }}
      >
        <CardSlider cards={cards} />
      </Box>
      <ReviewSlider reviews={reviews} />
    </Box>
  );
};

export default HomePage;

