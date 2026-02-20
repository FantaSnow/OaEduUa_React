"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import { Box, Typography, TextField, IconButton, Button } from "@mui/material";
import { useTheme as useAppTheme } from "@/providers/theme/ThemeProvider";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const Login: React.FC = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const router = useRouter();
  const { mode, toggleTheme } = useAppTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const success = await authLogin(login, password);
      if (success) {
        router.push("/HomePage");
      } else {
        setError("Не вдалося увійти. Перевірте логін або пароль.");
      }
    } catch (err) {
      setError("Помилка під час входу. Спробуйте пізніше.");
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "secondary.secondary10",
        display: "flex",
        alignItems: "center",
        justifyContent: "left",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <IconButton
        aria-label="toggle theme"
        onClick={toggleTheme}
        sx={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 1201,
          bgcolor: "background.paper",
          boxShadow: 2,
          "&:hover": { bgcolor: "background.default" },
        }}
        color="primary"
      >
        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>

      <Box
        sx={{
          width: { xs: "0", md: "50vw" },
          height: "80vh",
          minWidth: { md: 400 },
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "flex-start",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src="/assets/images/LoginPage.png"
          alt="Login"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "right",
            display: "block",
          }}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography variant="h1" color="text.primary">
            Welcome Back
          </Typography>
          <Typography variant="bodyM" color="text.primary">
            Всі права захищені кабом
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="bodyM" color="text.primary">
                Пошта
              </Typography>
              <TextField
                fullWidth
                placeholder="Введіть свою пошту"
                variant="outlined"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="bodyM" color="text.primary">
                Пароль
              </Typography>
              <TextField
                fullWidth
                placeholder="Введіть свій пароль"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
          </Box>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                typography: "buttonL",
              }}
              loading={loading}
            >
              Увійти
            </Button>
          </Box>
          {error && (
            <Typography
              variant="bodyM"
              color="error"
              sx={{
                marginTop: 2,
                textAlign: "center",
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Login;

