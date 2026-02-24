"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import VolunteeringService, {
  type VolunteeringCreateDto,
  type VolunteeringUpdateDto,
} from "@/api/services/VolunteeringService";
import VolunteeringCategoryService, {
  type VolunteeringCategoryCreateDto,
  type VolunteeringCategoryUpdateDto,
} from "@/api/services/VolunteeringCategoryService";
import { useEntityDetails } from "@/hooks/useEntityDetails";
import { unwrapApiResponse } from "@/types/api.types";
import type { VolunteeringEntity, VolunteeringCategory } from "@/types/entities";
import { formatDateOnlyEuropean, toDateOnly } from "@/utils/date";

const emptyCategory: VolunteeringCategoryCreateDto = { name: "" };

const emptyVolunteeringForm = {
  name: "",
  desc: "",
  date_start: "",
  date_end: "",
  location: "",
  department_id: "" as "" | number,
  user_id: "" as "" | number,
  goal: "" as "" | number,
  volunteeringcategory_id: "" as "" | number,
};

type VolunteeringFormState = typeof emptyVolunteeringForm;

const VolunteeringAdmin: React.FC = () => {
  const [tab, setTab] = useState(0);

  const [categories, setCategories] = useState<VolunteeringCategory[]>([]);
  const [vols, setVols] = useState<VolunteeringEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const [volForm, setVolForm] = useState<VolunteeringFormState>(emptyVolunteeringForm);
  const [editingVolId, setEditingVolId] = useState<number | null>(null);

  const [tableMode, setTableMode] = useState<"all" | "search">("all");
  const [searchType, setSearchType] = useState<"id" | "name">("id");
  const [findId, setFindId] = useState("");
  const [findName, setFindName] = useState("");
  const [foundVol, setFoundVol] = useState<VolunteeringEntity | null>(null);

  const entityDetails = useEntityDetails<VolunteeringEntity>();

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await VolunteeringCategoryService.getAll(0, 200);
      setCategories(unwrapApiResponse(data));
    } catch (e) {
      // 404 — можливо роутер volunteering-category не підключено або інший шлях на бекенді
      setCategories([]);
      const msg =
        e && typeof e === "object" && "response" in e
          ? (e as { response?: { status?: number } }).response?.status === 404
            ? "Категорії не знайдено (404). Перевірте, чи підключено роутер /volunteering-category на бекенді."
            : "Помилка завантаження категорій"
          : "Помилка завантаження категорій";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchVols = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await VolunteeringService.getAll(0, 200);
      setVols(unwrapApiResponse(data));
    } catch {
      setError("Помилка завантаження волонтерств");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchVols();
  }, []);

  const toVolCreateDto = (form: VolunteeringFormState): VolunteeringCreateDto => ({
    name: form.name.trim(),
    desc: form.desc.trim(),
    date_start: form.date_start.trim(),
    date_end: form.date_end.trim(),
    location: form.location.trim(),
    department_id: form.department_id === "" ? 0 : Number(form.department_id),
    goal: form.goal === "" ? 0 : Number(form.goal),
    volunteeringcategory_id:
      form.volunteeringcategory_id === "" ? 0 : Number(form.volunteeringcategory_id),
  });

  const toVolUpdateDto = (form: VolunteeringFormState, id: number): VolunteeringUpdateDto => ({
    id,
    name: form.name.trim(),
    desc: form.desc.trim(),
    date_start: form.date_start.trim(),
    date_end: form.date_end.trim(),
    location: form.location.trim(),
    department_id: form.department_id === "" ? 0 : Number(form.department_id),
    user_id: form.user_id === "" ? 0 : Number(form.user_id),
    goal: form.goal === "" ? 0 : Number(form.goal),
    volunteeringcategory_id:
      form.volunteeringcategory_id === "" ? 0 : Number(form.volunteeringcategory_id),
  });

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      if (editingCategoryId !== null) {
        await VolunteeringCategoryService.update({
          id: editingCategoryId,
          name: categoryName.trim(),
        } as VolunteeringCategoryUpdateDto);
      } else {
        await VolunteeringCategoryService.create({ name: categoryName.trim() });
      }
      setCategoryName("");
      setEditingCategoryId(null);
      await fetchCategories();
      await fetchVols();
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
      await VolunteeringCategoryService.delete(id);
      await fetchCategories();
      await fetchVols();
    } catch {
      setError("Помилка видалення категорії");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVolunteering = async () => {
    if (!volForm.name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      if (editingVolId !== null) {
        await VolunteeringService.update(toVolUpdateDto(volForm, editingVolId));
      } else {
        await VolunteeringService.create(toVolCreateDto(volForm));
      }
      setVolForm(emptyVolunteeringForm);
      setEditingVolId(null);
      await fetchVols();
    } catch (e) {
      setError(
        editingVolId !== null
          ? "Помилка оновлення волонтерства"
          : "Помилка створення волонтерства"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVolunteering = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await VolunteeringService.delete(id);
      await fetchVols();
    } catch {
      setError("Помилка видалення волонтерства");
    } finally {
      setLoading(false);
    }
  };

  const handleFindVol = async () => {
    setLoading(true);
    setError(null);
    setFoundVol(null);
    try {
      if (searchType === "id") {
        const id = Number(findId);
        if (!Number.isNaN(id)) {
          const data = await VolunteeringService.getById(id);
          setFoundVol(data);
        }
      } else {
        const all = await VolunteeringService.getAll(0, 200);
        const arr = unwrapApiResponse(all);
        const v = arr.find((x) => x.name === findName) ?? null;
        setFoundVol(v);
      }
    } catch {
      setError("Не знайдено");
    } finally {
      setLoading(false);
    }
  };

  const volTableData = useMemo(() => {
    if (tableMode === "all") return vols;
    if (!foundVol) return [];
    return [foundVol];
  }, [tableMode, vols, foundVol]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" color="text.primary" align="center" sx={{ mb: 3 }}>
        Адміністрування волонтерства
      </Typography>
      {loading && <CircularProgress sx={{ mb: 2 }} />}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Категорії волонтерства" />
        <Tab label="Волонтерства" />
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
              Створити / оновити волонтерство
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <TextField
                label="Назва"
                value={volForm.name}
                onChange={(e) => setVolForm({ ...volForm, name: e.target.value })}
                size="small"
                required
                sx={{ minWidth: 220, flex: "1 1 200px" }}
              />
              <FormControl size="small" sx={{ minWidth: 200, flex: "1 1 200px" }}>
                <InputLabel>Категорія</InputLabel>
                <Select
                  value={volForm.volunteeringcategory_id === "" ? "" : String(volForm.volunteeringcategory_id)}
                  label="Категорія"
                  onChange={(e) =>
                    setVolForm({
                      ...volForm,
                      volunteeringcategory_id: e.target.value === "" ? "" : Number(e.target.value),
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
              <TextField
                label="Опис"
                value={volForm.desc}
                onChange={(e) => setVolForm({ ...volForm, desc: e.target.value })}
                size="small"
                multiline
                sx={{ minWidth: 220, flex: "1 1 200px" }}
              />
              <TextField
                label="Мета (число)"
                type="number"
                value={volForm.goal === "" ? "" : volForm.goal}
                onChange={(e) =>
                  setVolForm({
                    ...volForm,
                    goal: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                size="small"
                sx={{ minWidth: 120 }}
              />
              <TextField
                label="Дата початку"
                type="date"
                value={volForm.date_start}
                onChange={(e) => setVolForm({ ...volForm, date_start: e.target.value || "" })}
                size="small"
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  max: volForm.date_end || undefined,
                }}
                sx={{ minWidth: 160 }}
              />
              <TextField
                label="Дата завершення"
                type="date"
                value={volForm.date_end}
                onChange={(e) => setVolForm({ ...volForm, date_end: e.target.value || "" })}
                size="small"
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: volForm.date_start || undefined,
                }}
                sx={{ minWidth: 160 }}
              />
              <TextField
                label="Локація"
                value={volForm.location}
                onChange={(e) => setVolForm({ ...volForm, location: e.target.value })}
                size="small"
                sx={{ minWidth: 200, flex: "1 1 200px" }}
              />
              <TextField
                label="ID кафедри"
                type="number"
                value={volForm.department_id === "" ? "" : volForm.department_id}
                onChange={(e) =>
                  setVolForm({
                    ...volForm,
                    department_id: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                size="small"
                sx={{ minWidth: 100 }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleSaveVolunteering} sx={{ mr: 2 }}>
                {editingVolId !== null ? "Зберегти зміни" : "Створити волонтерство"}
              </Button>
              {editingVolId !== null && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setVolForm(emptyVolunteeringForm);
                    setEditingVolId(null);
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
                  <Button variant="contained" onClick={handleFindVol}>
                    Знайти
                  </Button>
                </>
              )}
            </Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {tableMode === "all" ? "Всі волонтерства" : "Результат пошуку"}
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Назва</TableCell>
                  <TableCell>Опис</TableCell>
                  <TableCell>Дата початку</TableCell>
                  <TableCell>Дата кінця</TableCell>
                  <TableCell>Локація</TableCell>
                  <TableCell>Мета</TableCell>
                  <TableCell>Категорія</TableCell>
                  <TableCell>Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {volTableData.map((vol) => (
                  <TableRow key={vol.id}>
                    <TableCell>
                      <span
                        style={{
                          color: "#1976d2",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() =>
                          entityDetails.showDetails(
                            "Волонтерство",
                            VolunteeringService,
                            vol.id
                          )
                        }
                      >
                        {vol.id}
                      </span>
                    </TableCell>
                    <TableCell>{vol.name}</TableCell>
                    <TableCell sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {vol.desc ?? "—"}
                    </TableCell>
                    <TableCell>{formatDateOnlyEuropean(vol.date_start) || "—"}</TableCell>
                    <TableCell>{formatDateOnlyEuropean(vol.date_end) || "—"}</TableCell>
                    <TableCell>{vol.location ?? "—"}</TableCell>
                    <TableCell sx={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {vol.goal ?? "—"}
                    </TableCell>
                    <TableCell>
                      {vol.volunteeringcategory_id ? (
                        <span
                          style={{
                            color: "#1976d2",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() =>
                            entityDetails.showDetails(
                              "Категорія волонтерства",
                              VolunteeringCategoryService,
                              vol.volunteeringcategory_id
                            )
                          }
                        >
                          {vol.volunteeringcategory_id}
                        </span>
                      ) : (
                        "—"
                      )}
                      {vol.volunteeringcategory?.name
                        ? ` — ${vol.volunteeringcategory.name}`
                        : ""}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setVolForm({
                            name: vol.name,
                            desc: vol.desc ?? "",
                            date_start: toDateOnly(vol.date_start) || (vol.date_start ?? ""),
                            date_end: toDateOnly(vol.date_end) || (vol.date_end ?? ""),
                            location: vol.location ?? "",
                            department_id: vol.department_id ?? "",
                            user_id: vol.user_id ?? "",
                            goal: vol.goal ?? "",
                            volunteeringcategory_id: vol.volunteeringcategory_id ?? "",
                          });
                          setEditingVolId(vol.id);
                        }}
                        sx={{ mr: 1 }}
                      >
                        Редагувати
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleDeleteVolunteering(vol.id)}
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

export default VolunteeringAdmin;
