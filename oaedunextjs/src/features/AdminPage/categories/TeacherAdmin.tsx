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
import TeacherService from "@/api/services/TeacherService";
import DepartmentService from "@/api/services/DepartmentService";
import { useEntityDetails } from "@/hooks/useEntityDetails";
import { unwrapApiResponse } from "@/types/api.types";
import type { TeacherEntity, Department } from "@/types/entities";

const emptyTeacher = {
  id: 0,
  name: "",
  email: "",
  department_id: 0,
  connectionCode: "",
};

type TeacherField = keyof typeof emptyTeacher;

const TeacherAdmin: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherEntity[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTeacher, setNewTeacher] =
    useState<Record<TeacherField, string | number>>(emptyTeacher);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [tableMode, setTableMode] = useState<"all" | "search">("all");
  const [searchType, setSearchType] = useState<"id" | "name">("id");
  const [findId, setFindId] = useState("");
  const [findName, setFindName] = useState("");
  const [foundTeacher, setFoundTeacher] = useState<TeacherEntity | null>(null);

  const entityDetails = useEntityDetails<TeacherEntity>();

  useEffect(() => {
    DepartmentService.getAll(0, 100).then((res) =>
      setDepartments(unwrapApiResponse(res))
    );
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await TeacherService.getAll(0, 100);
      setTeachers(unwrapApiResponse(data));
    } catch {
      setError("Помилка завантаження викладачів");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      if (editingId !== null) {
        await TeacherService.update({
          id: editingId,
          name: String(newTeacher.name),
          email: String(newTeacher.email || ""),
          department_id: Number(newTeacher.department_id) || undefined,
          connectionCode: String(newTeacher.connectionCode || ""),
        });
      } else {
        await TeacherService.create({
          name: String(newTeacher.name),
          email: newTeacher.email ? String(newTeacher.email) : undefined,
          department_id: Number(newTeacher.department_id) || undefined,
        });
      }
      setNewTeacher(emptyTeacher);
      setEditingId(null);
      await fetchTeachers();
    } catch {
      setError(
        editingId !== null
          ? "Помилка оновлення викладача"
          : "Помилка створення викладача"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await TeacherService.delete(id);
      await fetchTeachers();
    } catch {
      setError("Помилка видалення викладача");
    } finally {
      setLoading(false);
    }
  };

  const handleFind = async () => {
    setLoading(true);
    setError(null);
    setFoundTeacher(null);
    try {
      let data = null;
      if (searchType === "id") {
        data = await TeacherService.getById(Number(findId));
      } else if (searchType === "name") {
        data = await TeacherService.getByName(findName);
      }
      setFoundTeacher(data);
    } catch {
      setError("Не знайдено");
    } finally {
      setLoading(false);
    }
  };

  const tableData = useMemo(() => {
    if (tableMode === "all") return teachers;
    if (!foundTeacher) return [];
    if (Array.isArray(foundTeacher)) return foundTeacher;
    return [foundTeacher];
  }, [tableMode, teachers, foundTeacher]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        color="text.primary"
        align="center"
        sx={{ mb: 3 }}
      >
        Адміністрування викладачів
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Створити/оновити викладача</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <TextField
            label="Ім'я"
            value={newTeacher.name}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, name: e.target.value })
            }
            size="small"
            fullWidth
            sx={{ minWidth: 200, flex: "1 1 200px" }}
          />
          <TextField
            label="Email"
            value={newTeacher.email}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, email: e.target.value })
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
              value={newTeacher.department_id}
              label="Кафедра"
              onChange={(e) =>
                setNewTeacher({
                  ...newTeacher,
                  department_id: Number(e.target.value),
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
            label="Код підключення"
            value={newTeacher.connectionCode}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, connectionCode: e.target.value })
            }
            size="small"
            fullWidth
            sx={{ minWidth: 200, flex: "1 1 200px" }}
          />
        </Box>
        <Button variant="contained" onClick={handleSave} sx={{ mt: 2, mr: 2 }}>
          {editingId !== null ? "Зберегти зміни" : "Створити викладача"}
        </Button>
        {editingId !== null && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setNewTeacher(emptyTeacher);
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
              <MenuItem value="all">Всі викладачі</MenuItem>
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
                  <MenuItem value="name">За ім'ям</MenuItem>
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
                  label="Ім'я"
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
          {tableMode === "all" ? "Всі викладачі" : "Результати пошуку"}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ім'я</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Кафедра</TableCell>
              <TableCell>Код підключення</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <span
                    style={{
                      color: "#1976d2",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() =>
                      entityDetails.showDetails(
                        "Викладач",
                        TeacherService,
                        teacher.id
                      )
                    }
                  >
                    {teacher.id}
                  </span>
                </TableCell>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>
                  <span
                    style={{
                      color: "#1976d2",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() =>
                      teacher.department_id &&
                      entityDetails.showDetails(
                        "Кафедра",
                        DepartmentService,
                        teacher.department_id
                      )
                    }
                  >
                    {teacher.department?.name || teacher.department_id}
                  </span>
                </TableCell>
                <TableCell>{teacher.connectionCode}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setNewTeacher({ ...emptyTeacher, ...teacher });
                      setEditingId(teacher.id);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Оновити
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleDelete(teacher.id)}
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

export default TeacherAdmin;
