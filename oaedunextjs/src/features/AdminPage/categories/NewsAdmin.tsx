"use client";

import React, { useEffect, useState, useMemo, type ChangeEvent } from "react";
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
  Tabs,
  Tab,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import NewsService, {
  type NewsCreateDto,
  type NewsUpdateDto,
} from "@/api/services/NewsService";
import NewsCategoryService, {
  type NewsCategoryCreateDto,
  type NewsCategoryUpdateDto,
} from "@/api/services/NewsCategoryService";
import DepartmentService from "@/api/services/DepartmentService";
import { useEntityDetails } from "@/hooks/useEntityDetails";
import { useTheme } from "@mui/material/styles";
import { unwrapApiResponse } from "@/types/api.types";
import type { NewsEntity, NewsCategory, Department } from "@/types/entities";
import { getNewsImageUrl } from "@/utils/newsImage";

const emptyCategory: NewsCategoryCreateDto = { name: "" };

const emptyNewsForm = {
  name: "",
  description: "",
  newscategory_id: "" as "" | number,
  department_id: "" as "" | number,
  main_image_file: null as File | null,
  gallery_files: [] as File[],
};

type NewsFormState = typeof emptyNewsForm;

const NewsAdmin: React.FC = () => {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newsList, setNewsList] = useState<NewsEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const [newsForm, setNewsForm] = useState<NewsFormState>(emptyNewsForm);
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);

  const [tableMode, setTableMode] = useState<"all" | "search">("all");
  const [searchType, setSearchType] = useState<"id" | "name">("id");
  const [findId, setFindId] = useState("");
  const [findName, setFindName] = useState("");
  const [foundNews, setFoundNews] = useState<NewsEntity | null>(null);

  const entityDetails = useEntityDetails<NewsEntity>();

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await NewsCategoryService.getAll(0, 200);
      setCategories(unwrapApiResponse(data) ?? []);
    } catch (e) {
      setCategories([]);
      const msg =
        e && typeof e === "object" && "response" in e
          ? (e as { response?: { status?: number } }).response?.status === 404
            ? "Категорії не знайдено (404). Перевірте шлях до API категорій новин."
            : "Помилка завантаження категорій"
          : "Помилка завантаження категорій";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await DepartmentService.getAll(0, 200);
      setDepartments(unwrapApiResponse(data) ?? []);
    } catch {
      setDepartments([]);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await NewsService.getAll(0, 200);
      setNewsList(unwrapApiResponse(data) ?? []);
    } catch {
      setError("Помилка завантаження новин");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      if (editingCategoryId !== null) {
        await NewsCategoryService.update({
          id: editingCategoryId,
          name: categoryName.trim(),
        } as NewsCategoryUpdateDto);
      } else {
        await NewsCategoryService.create({ name: categoryName.trim() });
      }
      setCategoryName("");
      setEditingCategoryId(null);
      await fetchCategories();
      await fetchNews();
    } catch {
      setError(
        editingCategoryId !== null
          ? "Помилка оновлення категорії"
          : "Помилка створення категорії (можливо, така назва вже є)"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await NewsCategoryService.delete(id);
      await fetchCategories();
      await fetchNews();
    } catch {
      setError("Помилка видалення категорії");
    } finally {
      setLoading(false);
    }
  };

  const toNewsCreateDto = (form: NewsFormState): NewsCreateDto => ({
    name: form.name.trim(),
    desc: form.description.trim(),
    categ: form.newscategory_id === "" ? 0 : Number(form.newscategory_id),
    depart: form.department_id === "" ? 0 : Number(form.department_id),
    main_image: form.main_image_file!,
    gallery_images: form.gallery_files.length ? form.gallery_files : undefined,
  });

  const toNewsUpdateDto = (form: NewsFormState, id: number): NewsUpdateDto => {
    const nid = Number(form.newscategory_id);
    const did = Number(form.department_id);
    return {
      id: Number(id),
      name: (form.name ?? "").trim(),
      description: (form.description ?? "").trim(),
      newscategory_id: (form.newscategory_id !== "" && !Number.isNaN(nid)) ? nid : 0,
      department_id: (form.department_id !== "" && !Number.isNaN(did)) ? did : 0,
    };
  };

  const handleSaveNews = async () => {
    if (!newsForm.name.trim()) return;
    if (editingNewsId === null) {
      if (!newsForm.main_image_file) {
        setError("Оберіть головне зображення для нової новини");
        return;
      }
      const categ = newsForm.newscategory_id === "" ? 0 : Number(newsForm.newscategory_id);
      const depart = newsForm.department_id === "" ? 0 : Number(newsForm.department_id);
      if (!categ || !depart) {
        setError("Оберіть категорію та кафедру");
        return;
      }
    } else {
      const categ = newsForm.newscategory_id === "" ? 0 : Number(newsForm.newscategory_id);
      const depart = newsForm.department_id === "" ? 0 : Number(newsForm.department_id);
      if (!categ || !depart) {
        setError("Оберіть категорію та кафедру для оновлення");
        return;
      }
    }
    setLoading(true);
    setError(null);
    try {
      if (editingNewsId !== null) {
        await NewsService.update(toNewsUpdateDto(newsForm, editingNewsId));
      } else {
        await NewsService.create(toNewsCreateDto(newsForm));
      }
      setNewsForm(emptyNewsForm);
      setEditingNewsId(null);
      await fetchNews();
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response
          ? (() => {
              const d = (err as { response: { data: unknown } }).response.data;
              if (d && typeof d === "object" && "detail" in d) {
                const detail = (d as { detail: unknown }).detail;
                if (Array.isArray(detail))
                  return `422: ${detail.map((e: { msg?: string; loc?: unknown }) => e.msg ?? JSON.stringify(e.loc)).join("; ")}`;
                return `422: ${String(detail)}`;
              }
              return String(d);
            })()
          : null;
      setError(
        msg ||
          (editingNewsId !== null
            ? "Помилка оновлення новини"
            : "Помилка створення новини")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id: number) => {
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

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewsForm({
        ...newsForm,
        main_image_file: e.target.files[0],
      });
    }
  };

  const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewsForm({
        ...newsForm,
        gallery_files: Array.from(e.target.files),
      });
    }
  };

  const handleFindNews = async () => {
    setLoading(true);
    setError(null);
    setFoundNews(null);
    try {
      if (searchType === "id") {
        const id = Number(findId);
        if (!Number.isNaN(id)) {
          const data = await NewsService.getById(id);
          setFoundNews(data);
        }
      } else {
        const all = await NewsService.getAll(0, 200);
        const arr = unwrapApiResponse(all);
        setFoundNews(arr.find((n) => n.name === findName) ?? null);
      }
    } catch {
      setError("Не знайдено");
    } finally {
      setLoading(false);
    }
  };

  const tableData = useMemo(() => {
    if (tableMode === "all") return newsList;
    if (!foundNews) return [];
    return [foundNews];
  }, [tableMode, newsList, foundNews]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" color="text.primary" align="center" sx={{ mb: 3 }}>
        Адміністрування новин
      </Typography>
      {loading && <CircularProgress sx={{ mb: 2 }} />}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Категорії новин" />
        <Tab label="Новини" />
      </Tabs>

      {tab === 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Створити / оновити категорію
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Назва категорії"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              size="small"
              sx={{ minWidth: 260 }}
            />
            <Button variant="contained" onClick={handleSaveCategory}>
              {editingCategoryId !== null ? "Зберегти зміни" : "Створити категорію"}
            </Button>
            {editingCategoryId !== null && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setCategoryName("");
                  setEditingCategoryId(null);
                }}
              >
                Скасувати
              </Button>
            )}
          </Box>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Список категорій
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Назва</TableCell>
                <TableCell>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.id}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setCategoryName(cat.name);
                        setEditingCategoryId(cat.id);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Редагувати
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      Видалити
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {tab === 1 && (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Створити / оновити новину
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <TextField
                label="Назва"
                value={newsForm.name}
                onChange={(e) => setNewsForm({ ...newsForm, name: e.target.value })}
                size="small"
                required
                sx={{ minWidth: 220, flex: "1 1 200px" }}
              />
              <TextField
                label="Опис"
                value={newsForm.description}
                onChange={(e) =>
                  setNewsForm({ ...newsForm, description: e.target.value })
                }
                size="small"
                multiline
                sx={{ minWidth: 220, flex: "1 1 200px" }}
              />
              <FormControl size="small" sx={{ minWidth: 200, flex: "1 1 200px" }}>
                <InputLabel>Категорія новин</InputLabel>
                <Select
                  value={
                    newsForm.newscategory_id === ""
                      ? ""
                      : String(newsForm.newscategory_id)
                  }
                  label="Категорія новин"
                  onChange={(e) =>
                    setNewsForm({
                      ...newsForm,
                      newscategory_id:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                >
                  <MenuItem value="">— не обрано —</MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 200, flex: "1 1 200px" }}>
                <InputLabel>Кафедра</InputLabel>
                <Select
                  value={
                    newsForm.department_id === ""
                      ? ""
                      : String(newsForm.department_id)
                  }
                  label="Кафедра"
                  onChange={(e) =>
                    setNewsForm({
                      ...newsForm,
                      department_id:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                >
                  <MenuItem value="">— не обрано —</MenuItem>
                  {departments.map((d) => (
                    <MenuItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {editingNewsId === null && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: "1 1 100%" }}>
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
                      minWidth: 200,
                    }}
                  >
                    Головне зображення *
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleMainImageChange}
                    />
                  </Button>
                  {newsForm.main_image_file && (
                    <Box
                      sx={{
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
                        src={URL.createObjectURL(newsForm.main_image_file)}
                        alt=""
                        style={{ maxWidth: 40, maxHeight: 40, borderRadius: 4 }}
                      />
                      <Typography variant="body2" sx={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {newsForm.main_image_file.name}
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() =>
                          setNewsForm({ ...newsForm, main_image_file: null })
                        }
                      >
                        ×
                      </Button>
                    </Box>
                  )}
                </Box>
              )}

              {editingNewsId === null && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: "1 1 100%" }}>
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
                    }}
                  >
                    Галерея
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      multiple
                      onChange={handleGalleryChange}
                    />
                  </Button>
                  {newsForm.gallery_files.length > 0 && (
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                      {newsForm.gallery_files.map((file, idx) => (
                        <Box key={idx} sx={{ position: "relative" }}>
                          <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            style={{ maxWidth: 40, maxHeight: 40, borderRadius: 4 }}
                          />
                          <Button
                            size="small"
                            color="error"
                            sx={{ position: "absolute", top: -8, right: -8, minWidth: 24, minHeight: 24, p: 0 }}
                            onClick={() => {
                              const arr = newsForm.gallery_files.filter((_, i) => i !== idx);
                              setNewsForm({ ...newsForm, gallery_files: arr });
                            }}
                          >
                            ×
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleSaveNews} sx={{ mr: 2 }}>
                {editingNewsId !== null ? "Зберегти зміни" : "Створити новину"}
              </Button>
              {editingNewsId !== null && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setNewsForm(emptyNewsForm);
                    setEditingNewsId(null);
                  }}
                >
                  Скасувати редагування
                </Button>
              )}
            </Box>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Режим</InputLabel>
                <Select
                  value={tableMode}
                  label="Режим"
                  onChange={(e) => setTableMode(e.target.value as "all" | "search")}
                >
                  <MenuItem value="all">Всі</MenuItem>
                  <MenuItem value="search">Пошук</MenuItem>
                </Select>
              </FormControl>
              {tableMode === "search" && (
                <>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Тип</InputLabel>
                    <Select
                      value={searchType}
                      label="Тип"
                      onChange={(e) => setSearchType(e.target.value as "id" | "name")}
                    >
                      <MenuItem value="id">ID</MenuItem>
                      <MenuItem value="name">Назва</MenuItem>
                    </Select>
                  </FormControl>
                  {searchType === "id" && (
                    <TextField
                      label="ID"
                      value={findId}
                      onChange={(e) => setFindId(e.target.value)}
                      size="small"
                      type="number"
                      sx={{ width: 100 }}
                    />
                  )}
                  {searchType === "name" && (
                    <TextField
                      label="Назва"
                      value={findName}
                      onChange={(e) => setFindName(e.target.value)}
                      size="small"
                      sx={{ minWidth: 200 }}
                    />
                  )}
                  <Button variant="contained" onClick={handleFindNews}>
                    Знайти
                  </Button>
                </>
              )}
            </Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {tableMode === "all" ? "Всі новини" : "Результат пошуку"}
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Назва</TableCell>
                  <TableCell>Опис</TableCell>
                  <TableCell>Категорія</TableCell>
                  <TableCell>Кафедра</TableCell>
                  <TableCell>Головне зображення</TableCell>
                  <TableCell>Галерея</TableCell>
                  <TableCell>Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((news, index) => (
                  <TableRow key={`news-${news.id ?? index}-${index}`}>
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
                    <TableCell sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {news.description ?? "—"}
                    </TableCell>
                    <TableCell>
                      {news.newscategory?.name ?? news.newscategory_id ?? "—"}
                    </TableCell>
                    <TableCell>
                      {news.department?.name ?? news.department_id ?? "—"}
                    </TableCell>
                    <TableCell>
                      {news.photo_path ? (
                        <a
                          href={getNewsImageUrl(news.photo_path)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={getNewsImageUrl(news.photo_path)}
                            alt=""
                            style={{ maxWidth: 60, maxHeight: 60, objectFit: "cover" }}
                          />
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {news.gallery_photos?.length
                        ? `${news.gallery_photos.length} фото`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setNewsForm({
                            name: news.name,
                            description: news.description ?? "",
                            newscategory_id: news.newscategory_id ?? "",
                            department_id: news.department_id ?? "",
                            main_image_file: null,
                            gallery_files: [],
                          });
                          setEditingNewsId(news.id);
                        }}
                        sx={{ mr: 1 }}
                      >
                        Редагувати
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleDeleteNews(news.id)}
                      >
                        Видалити
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}

      <Dialog
        open={entityDetails.modalOpen}
        onClose={entityDetails.close}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{entityDetails.modalTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
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
