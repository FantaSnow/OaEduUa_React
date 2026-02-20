import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
const volunteerImg = "/assets/images/NoPhoto.jpg";

const dataSource = [
  {
    id: "1",
    title: "Допоможіть організувати благодійний ярмарок для підтримки ЗСУ",
    date: "10 червня 2025",
    location: "м. Київ, вул. Хрещатик, 22",
    org: "Благодійний фонд 'Відкриті Серця'",
    orgLogo: "https://smr.gov.ua/images/news/Podii/2023/04/11/5.jpg",
    image: "https://smr.gov.ua/images/news/Podii/2023/04/11/5.jpg",
    shifts: [
      "09:00 – 12:00 — потрібні 5 волонтерів;",
      "12:00 – 15:00 — потрібні 5 волонтерів;",
      "15:00 – 18:00 — потрібні 5 волонтерів;",
    ],
    description:
      "Долучайтесь до організації благодійного ярмарку для збору коштів на підтримку ЗСУ. Потрібна допомога з підготовкою локації, роздачею листівок, організацією майстер-класів та підтримкою гостей.",
    tags: ["Організація", "Благодійність", "ЗСУ"],
    banner: "https://smr.gov.ua/images/news/Podii/2023/04/11/5.jpg",
  },
  {
    id: "2",
    title: "Волонтер у притулку для тварин “Друзі”",
    date: "Щосуботи, червень–серпень 2025",
    location: "м. Львів, вул. Зелена, 145",
    org: "Притулок 'Друзі'",
    orgLogo: volunteerImg,
    image: volunteerImg,
    shifts: [
      "10:00 – 13:00 — потрібні 2 волонтери;",
      "13:00 – 16:00 — потрібні 2 волонери;",
    ],
    description:
      "Потрібні волонтери для вигулу собак, прибирання території та допомоги у догляді за тваринами. Досвід не обов'язковий, головне — любов до тварин!",
    tags: ["Тварини", "Догляд", "Допомога"],
    banner: volunteerImg,
  },
  {
    id: "3",
    title: "Проведення майстер-класів для дітей у лікарні",
    date: "Щосереди, 15:00 – 17:00",
    location: "м. Харків, вул. Наукова, 7, дитяча лікарня №3",
    org: "ГО 'Щасливе дитинство'",
    orgLogo: volunteerImg,
    image: volunteerImg,
    shifts: ["15:00 – 17:00 — потрібні 3 волонтери;"],
    description:
      "Запрошуємо креативних волонтерів для проведення майстер-класів з малювання, ліплення та інших творчих занять для дітей, які перебувають на лікуванні.",
    tags: ["Діти", "Творчість", "Майстер-клас"],
    banner: volunteerImg,
  },
];

const VolunteeringDetails: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<(typeof dataSource)[number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      const item = dataSource.find((x) => x.id === params.id) || null;
      setData(item);
      setLoading(false);
    }
  }, [params?.id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 6 }}>
        <Typography variant="h2" color="error">
          Волонтерство не знайдено
        </Typography>
        <Button sx={{ mt: 2 }} onClick={() => router.back()}>
          Назад
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", px: 10 }}>
      <Box
        sx={{
          maxWidth: 1600,
          mx: "auto",
          py: 5,
          px: 4,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            mb: 2,
          }}
        >
          <Typography variant="h1" color="text.primary">
            {data.title}
          </Typography>
          <Button variant="outlined" onClick={() => router.back()}>
            Назад
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 5,
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              bgcolor: "secondary.secondary10",
              borderRadius: 4,
              p: 4,
              minWidth: 0,
              boxShadow: "0px 4px 5px 2px #00000024",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h4" color="text.primary">
              {data.date}
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ mb: 2 }}>
              {data.location}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              {data.tags.map((tag, idx) => (
                <Button
                  key={idx}
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: "primary.primary20",
                    px: 2,
                    minWidth: 80,
                    width: "auto",
                    boxShadow: "none",
                  }}
                >
                  {tag}
                </Button>
              ))}
            </Box>
            <Typography variant="h2" color="text.primary" sx={{ mt: 2, mb: 1 }}>
              Ставай волонтером у пробації
            </Typography>
            <Typography variant="bodyM" color="text.primary" sx={{ mb: 3 }}>
              {data.description}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="h2"
                color="text.primary"
                sx={{
                  mb: 1,
                }}
              >
                Графік роботи поділений на 3 зміни (можна обрати зручну):
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {data.shifts.map((shift, idx) => (
                  <li key={idx}>
                    <Typography variant="bodyM" color="text.primary">
                      {shift}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              minWidth: 520,
              maxWidth: 700,
              width: "40%",
              borderRadius: 4,
              boxShadow: "0px 4px 5px 2px #00000024",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 0,
              overflow: "hidden",
              height: 420,
            }}
          >
            <Box
              component="img"
              src={data.banner as string}
              alt="banner"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default VolunteeringDetails;

