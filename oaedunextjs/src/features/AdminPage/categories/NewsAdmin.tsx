"use client";

import React, { useEffect, useState, useMemo } from "react";
import type { ChangeEvent } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  TextField,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import NewsService from "@/api/services/NewsService";
import DepartmentService from "@/api/services/DepartmentService";
import { useEntityDetails } from "@/hooks/useEntityDetails";
import { useTheme } from "@mui/material/styles";
import { unwrapApiResponse } from "@/types/api.types";
import type { NewsEntity, Department } from "@/types/entities";

const emptyNews = {
  id: 0,
  name: "",
  description: "",
  category: "",
  department_id: "",
  user_id: "",
  main_image_path: "",
  main_image_file: null as File | null,
  gallery_photos: [] as string[],
  gallery_files: [] as File[],
  users: { id: 0, name: "", email: "" },
  department: { name: "", id: 0 },
};

type NewsField = keyof typeof emptyNews;

const NewsAdmin: React.FC = () => {
  const theme = useTheme();
  const [newsList, setNewsList] = useState<NewsEntity[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newNews, setNewNews] = useState<typeof emptyNews>(emptyNews);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [tableMode, setTableMode] = useState<"all" | "search">("all");
  const [searchType, setSearchType] = useState<"id" | "name">("id");
  const [findId, setFindId] = useState("");
  const [findName, setFindName] = useState("");
  const [foundNews, setFoundNews] = useState<NewsEntity | null>(null);

  const entityDetails = useEntityDetails<NewsEntity>();

  useEffect(() => {
    DepartmentService.getAll(0, 100).then((res) =>
      setDepartments(unwrapApiResponse(res))
    );
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await NewsService.getAll(0, 100);
      setNewsList(unwrapApiResponse(data));
    } catch {
      setError("Помилка завантаження новин");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewNews({
        ...newNews,
        main_image_file: e.target.files[0],
        main_image_path: "",
      });
    }
  };

  const handleGalleryImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewNews({
        ...newNews,
        gallery_files: Array.from(e.target.files),
        gallery_photos: [],
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      let payload: Record<string, unknown> | FormData = { ...newNews };
      if (
        newNews.main_image_file ||
        (newNews.gallery_files && newNews.gallery_files.length > 0)
      ) {
        const formData = new FormData();
        formData.append("name", newNews.name);
        formData.append("description", newNews.description);
        formData.append("category", newNews.category);
        formData.append("department_id", newNews.department_id);
        formData.append("user_id", newNews.user_id);
        if (newNews.main_image_file) {
          formData.append("main_image", newNews.main_image_file);
        }
        if (newNews.gallery_files && newNews.gallery_files.length > 0) {
          newNews.gallery_files.forEach((file: File) =>
            formData.append("gallery_images", file)
          );
        }
        payload = formData;
      } else {
        payload.gallery_photos = newNews.gallery_photos;
      }

      if (editingId !== null) {
        if (payload instanceof FormData) {
          payload.append("id", String(editingId));
          await NewsService.update(payload);
        } else {
          await NewsService.update({ ...payload, id: editingId });
        }
      } else {
        await NewsService.create(payload);
      }
      setNewNews(emptyNews);
      setEditingId(null);
      await fetchNews();
    } catch {
      setError(
        editingId !== null
          ? "Помилка оновлення новини"
          : "Помилка створення новини"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await NewsService.delete(id);
      await fetchNews();
    } catch {
      setError("Помилка видалення новини");
    } finally {
      setLoading(false);
    }
  };

  const handleFind = async () => {
    setLoading(true);
    setError(null);
    setFoundNews(null);
    try {
      let data: NewsEntity | null = null;
      if (searchType === "id") {
        data = await NewsService.getById(Number(findId));
      } else if (searchType === "name") {
        const all = await NewsService.getAll(0, 100);
        const arr = unwrapApiResponse(all);
        data = arr.find((n) => n.name === findName) ?? null;
      }
      setFoundNews(data);
    } catch {
      setError("Не знайдено");
    } finally {
      setLoading(false);
    }
  };

  const tableData = useMemo(() => {
    if (tableMode === "all") return newsList;
    if (!foundNews) return [];
    if (Array.isArray(foundNews)) return foundNews;
    return [foundNews];
  }, [tableMode, newsList, foundNews]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        color="text.primary"
        align="center"
        sx={{ mb: 3 }}
      >
        Адміністрування новин
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Створити/оновити новину
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
            alignItems: "flex-end",
          }}
        >
          <TextField
            label="Назва"
            value={newNews.name}
            onChange={(e) => setNewNews({ ...newNews, name: e.target.value })}
            size="small"
            fullWidth
            sx={{ minWidth: 200, flex: "1 1 200px" }}
          />
          <TextField
            label="Опис"
            value={newNews.description}
            onChange={(e) =>
              setNewNews({ ...newNews, description: e.target.value })
            }
            size="small"
            fullWidth
            sx={{ minWidth: 200, flex: "1 1 200px" }}
          />
          <FormControl
            fullWidth
            size="small"
            sx={{ minWidth: 200, flex: "1 1 200px" }}
          >
            <InputLabel>Кафедра</InputLabel>
            <Select
              value={newNews.department_id}
              label="Кафедра"
              onChange={(e) =>
                setNewNews({
                  ...newNews,
                  department_id: e.target.value,
                })
              }
            >
              {departments.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name} (id: {d.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="User ID"
            value={newNews.user_id}
            onChange={(e) =>
              setNewNews({ ...newNews, user_id: e.target.value })
            }
            size="small"
            type="number"
            fullWidth
            sx={{ minWidth: 120, flex: "1 1 120px" }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{
                bgcolor: theme.palette.background.paper,
                border: `1px dashed ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                  borderColor: theme.palette.primary.dark,
                  color: theme.palette.primary.dark,
                },
                minWidth: 180,
                transition: "all 0.2s",
              }}
            >
              Головне зображення
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleMainImageChange}
              />
            </Button>
            {newNews.main_image_file && (
              <Box
                sx={{
                  ml: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: theme.palette.background.default,
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <img
                  src={URL.createObjectURL(newNews.main_image_file)}
                  alt="main"
                  style={{ maxWidth: 40, maxHeight: 40, borderRadius: 4 }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: 120,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {newNews.main_image_file.name}
                </Typography>
                <Button
                  size="small"
                  color="error"
                  onClick={() =>
                    setNewNews({ ...newNews, main_image_file: null })
                  }
                >
                  ×
                </Button>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flex: "1 1 300px",
            }}
          >
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{
                bgcolor: theme.palette.background.paper,
                border: `1px dashed ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                  borderColor: theme.palette.primary.dark,
                  color: theme.palette.primary.dark,
                },
                minWidth: 180,
                transition: "all 0.2s",
              }}
            >
              Галерея
              <input
                type="file"
                accept="image/*"
                hidden
                multiple
                onChange={handleGalleryImagesChange}
              />
            </Button>
            {newNews.gallery_files && newNews.gallery_files.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                  bgcolor: theme.palette.background.default,
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  border: `1px solid ${theme.palette.divider}`,
                  minHeight: 48,
                }}
              >
                {newNews.gallery_files.map((file: File, idx: number) => (
                  <Box key={idx} sx={{ position: "relative", mr: 1 }}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`gallery-${idx}`}
                      style={{ maxWidth: 40, maxHeight: 40, borderRadius: 4 }}
                    />
                    <Button
                      size="small"
                      color="error"
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        minWidth: 24,
                        minHeight: 24,
                        p: 0,
                        fontSize: 16,
                      }}
                      onClick={() => {
                        const arr = [...newNews.gallery_files];
                        arr.splice(idx, 1);
                        setNewNews({ ...newNews, gallery_files: arr });
                      }}
                    >
                      ×
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
        <Button variant="contained" onClick={handleSave} sx={{ mt: 2, mr: 2 }}>
          {editingId !== null ? "Зберегти зміни" : "Створити новину"}
        </Button>
        {editingId !== null && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setNewNews(emptyNews);
              setEditingId(null);
            }}
            sx={{ mt: 2 }}
          >
            Скасувати редагування
          </Button>
        )}
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FormControl sx={{ minWidth: 180, mr: 2 }} size="small">
            <InputLabel>Режим</InputLabel>
            <Select
              value={tableMode}
              label="Режим"
              onChange={(e) => setTableMode(e.target.value as "all" | "search")}
            >
              <MenuItem value="all">Всі новини</MenuItem>
              <MenuItem value="search">Пошук</MenuItem>
            </Select>
          </FormControl>
          {tableMode === "search" && (
            <>
              <FormControl sx={{ minWidth: 180, mr: 2 }} size="small">
                <InputLabel>Тип пошуку</InputLabel>
                <Select
                  value={searchType}
                  label="Тип пошуку"
                  onChange={(e) => setSearchType(e.target.value as "id" | "name")}
                >
                  <MenuItem value="id">За ID</MenuItem>
                  <MenuItem value="name">За назвою</MenuItem>
                </Select>
              </FormControl>
              {searchType === "id" && (
                <TextField
                  label="ID"
                  value={findId}
                  onChange={(e) => setFindId(e.target.value)}
                  size="small"
                  sx={{ mr: 2 }}
                />
              )}
              {searchType === "name" && (
                <TextField
                  label="Назва"
                  value={findName}
                  onChange={(e) => setFindName(e.target.value)}
                  size="small"
                  sx={{ mr: 2 }}
                />
              )}
              <Button variant="outlined" onClick={handleFind} sx={{ ml: 2 }}>
                Знайти
              </Button>
            </>
          )}
        </Box>

        <Typography variant="h6" sx={{ mb: 1 }}>
          {tableMode === "all" ? "Всі новини" : "Результати пошуку"}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Назва</TableCell>
              <TableCell>Опис</TableCell>
              <TableCell>Департамент</TableCell>
              <TableCell>Користувач</TableCell>
              <TableCell>Головне зображення</TableCell>
              <TableCell>Галерея</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((news) => (
              <TableRow key={news.id}>
                <TableCell>
                  <span
                    style={{
                      color: "#1976d2",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() =>
                      entityDetails.showDetails("Новина", NewsService, news.id)
                    }
                  >
                    {news.id}
                  </span>
                </TableCell>
                <TableCell>{news.name}</TableCell>
                <TableCell>{news.description}</TableCell>
                <TableCell>
                  {news.department?.name ||
                    departments.find((d) => d.id === news.department_id)
                      ?.name ||
                    news.department_id}
                </TableCell>
                <TableCell>
                  {news.users?.name || news.user_id}
                  {news.users?.email && (
                    <span style={{ color: "#888", fontSize: 12 }}>
                      <br />
                      {news.users.email}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {news.photo_path && (
                    <a
                      href={news.photo_path}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={news.photo_path}
                        alt="main"
                        style={{ maxWidth: 80, maxHeight: 80 }}
                      />
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  {Array.isArray(news.gallery_photos) &&
                  news.gallery_photos.length > 0
                    ? news.gallery_photos.map(
                        (imgObj: { image_path?: string }, idx: number) =>
                          imgObj.image_path && (
                            <a
                              key={idx}
                              href={imgObj.image_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ marginRight: 4 }}
                            >
                              <img
                                src={imgObj.image_path}
                                alt={`gallery-${idx}`}
                                style={{ maxWidth: 50, maxHeight: 50 }}
                              />
                            </a>
                          )
                      )
                    : ""}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setNewNews({ ...emptyNews, ...news });
                      setEditingId(news.id);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Оновити
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleDelete(news.id)}
                  >
                    Видалити
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog
        open={entityDetails.modalOpen}
        onClose={entityDetails.close}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{entityDetails.modalTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <pre style={{ fontSize: 14, whiteSpace: "pre-wrap" }}>
              {entityDetails.loading
                ? "Завантаження..."
                : entityDetails.modalData
                ? JSON.stringify(entityDetails.modalData, null, 2)
                : "Немає даних"}
            </pre>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={entityDetails.close}>Закрити</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewsAdmin;
