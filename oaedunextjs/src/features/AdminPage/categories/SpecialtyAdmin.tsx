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
} from "@mui/material";
import SpecialtyService from "@/api/services/SpecialtyService";
import DepartmentService from "@/api/services/DepartmentService";
import { useEntityDetails } from "@/hooks/useEntityDetails";
import { unwrapApiResponse } from "@/types/api.types";
import type { Specialty, Department } from "@/types/entities";

const emptySpecialty = {
  id: 0,
  name: "",
  specialty_number: "",
  department_id: "",
};

type SpecialtyField = keyof typeof emptySpecialty;

const SpecialtyAdmin: React.FC = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSpecialty, setNewSpecialty] =
    useState<Record<SpecialtyField, string | number>>(emptySpecialty);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [tableMode, setTableMode] = useState<"all" | "search">("all");
  const [searchType, setSearchType] = useState<"id" | "name">("id");
  const [findId, setFindId] = useState("");
  const [findName, setFindName] = useState("");
  const [foundSpecialty, setFoundSpecialty] = useState<Specialty | null>(null);

  const entityDetails = useEntityDetails<Specialty>();

  useEffect(() => {
    DepartmentService.getAll(0, 100).then((res) =>
      setDepartments(unwrapApiResponse(res))
    );
  }, []);

  const fetchSpecialties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await SpecialtyService.getAll(0, 100);
      setSpecialties(unwrapApiResponse(data));
    } catch {
      setError("Помилка завантаження спеціальностей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const handleSave = async () => {
    const name = String(newSpecialty.name ?? "").trim();
    const specialty_number = Number(newSpecialty.specialty_number);
    const department_id =
      newSpecialty.department_id === "" || newSpecialty.department_id == null
        ? undefined
        : Number(newSpecialty.department_id);

    if (!name) {
      setError("Введіть назву спеціальності");
      return;
    }
    if (Number.isNaN(specialty_number) || specialty_number < 0) {
      setError("Номер спеціальності має бути невід'ємним числом");
      return;
    }
    if (department_id === undefined || Number.isNaN(department_id)) {
      setError("Оберіть кафедру");
      return;
    }

    const payload = {
      name,
      specialty_number,
      department_id,
    };

    setLoading(true);
    setError(null);
    try {
      if (editingId !== null) {
        await SpecialtyService.update({ ...payload, id: editingId });
      } else {
        await SpecialtyService.create(payload);
      }
      setNewSpecialty(emptySpecialty);
      setEditingId(null);
      await fetchSpecialties();
    } catch {
      setError(
        editingId !== null
          ? "Помилка оновлення спеціальності"
          : "Помилка створення спеціальності"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await SpecialtyService.delete(id);
      await fetchSpecialties();
    } catch {
      setError("Помилка видалення спеціальності");
    } finally {
      setLoading(false);
    }
  };

  const handleFind = async () => {
    setLoading(true);
    setError(null);
    setFoundSpecialty(null);
    try {
      let data = null;
      if (searchType === "id") {
        data = await SpecialtyService.getById(Number(findId));
      } else if (searchType === "name") {
        data = await SpecialtyService.getByName(findName);
      }
      setFoundSpecialty(data);
    } catch {
      setError("Не знайдено");
    } finally {
      setLoading(false);
    }
  };

  const tableData = useMemo(() => {
    if (tableMode === "all") return specialties;
    if (!foundSpecialty) return [];
    if (Array.isArray(foundSpecialty)) return foundSpecialty;
    return [foundSpecialty];
  }, [tableMode, specialties, foundSpecialty]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        color="text.primary"
        align="center"
        sx={{ mb: 3 }}
      >
        Адміністрування спеціальностей
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Створити/оновити спеціальність</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <TextField
            label="Назва"
            value={newSpecialty.name}
            onChange={(e) =>
              setNewSpecialty({ ...newSpecialty, name: e.target.value })
            }
            size="small"
            fullWidth
            sx={{ minWidth: 200, flex: "1 1 200px" }}
          />
          <TextField
            label="Номер спеціальності"
            value={newSpecialty.specialty_number}
            onChange={(e) =>
              setNewSpecialty({
                ...newSpecialty,
                specialty_number: e.target.value,
              })
            }
            size="small"
            type="number"
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
              value={
                newSpecialty.department_id === "" ||
                newSpecialty.department_id == null
                  ? ""
                  : String(newSpecialty.department_id)
              }
              label="Кафедра"
              onChange={(e) =>
                setNewSpecialty({
                  ...newSpecialty,
                  department_id:
                    e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            >
              <MenuItem value="">— не обрано —</MenuItem>
              {departments.map((d) => (
                <MenuItem key={d.id} value={String(d.id)}>
                  {d.name} (id: {d.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" onClick={handleSave} sx={{ mt: 2, mr: 2 }}>
          {editingId !== null ? "Зберегти зміни" : "Створити спеціальність"}
        </Button>
        {editingId !== null && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setNewSpecialty(emptySpecialty);
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
              <MenuItem value="all">Всі спеціальності</MenuItem>
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
          {tableMode === "all" ? "Всі спеціальності" : "Результати пошуку"}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Назва</TableCell>
              <TableCell>Номер спеціальності</TableCell>
              <TableCell>Кафедра</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((specialty) => (
              <TableRow key={specialty.id}>
                <TableCell>
                  <span
                    style={{
                      color: "#1976d2",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() =>
                      entityDetails.showDetails(
                        "Спеціальність",
                        SpecialtyService,
                        specialty.id
                      )
                    }
                  >
                    {specialty.id}
                  </span>
                </TableCell>
                <TableCell>{specialty.name}</TableCell>
                <TableCell>{specialty.specialty_number}</TableCell>
                <TableCell>
                  <span
                    style={{
                      color: "#1976d2",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() =>
                      specialty.department_id &&
                      entityDetails.showDetails(
                        "Кафедра",
                        DepartmentService,
                        specialty.department_id
                      )
                    }
                  >
                    {departments.find((d) => d.id === specialty.department_id)
                      ?.name || specialty.department_id}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setNewSpecialty({ ...emptySpecialty, ...specialty });
                      setEditingId(specialty.id);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Оновити
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleDelete(specialty.id)}
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

export default SpecialtyAdmin;
