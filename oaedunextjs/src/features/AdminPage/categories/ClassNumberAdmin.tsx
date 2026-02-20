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
import ClassNumberService from "@/api/services/ClassNumberService";
import { useEntityDetails } from "@/hooks/useEntityDetails";
import { toIsoTime } from "@/utils/date";
import { unwrapApiResponse } from "@/types/api.types";
import type { ClassNumberEntity } from "@/types/entities";

const formatTimeToHHMM = (timeString: string | number): string => {
  if (timeString == null || timeString === "") return "";
  return String(timeString).substring(0, 5);
};

const formatTimeForSend = (timeString: string | number): string => {
  if (timeString == null || timeString === "") return "";
  const hhMm = formatTimeToHHMM(timeString);
  if (hhMm.length === 5) {
    return `${hhMm}:00`;
  }
  return String(timeString);
};

const emptyClassNumber = {
  id: 0,
  number: "",
  time_start: "",
  time_end: "",
};

type ClassNumberField = keyof typeof emptyClassNumber;

const ClassNumberAdmin: React.FC = () => {
  const [classNumbers, setClassNumbers] = useState<ClassNumberEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newClassNumber, setNewClassNumber] =
    useState<Record<ClassNumberField, string | number>>(emptyClassNumber);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [tableMode, setTableMode] = useState<"all" | "search">("all");
  const [searchType, setSearchType] = useState<"id" | "number">("id");
  const [findId, setFindId] = useState("");
  const [findNumber, setFindNumber] = useState("");
  const [foundClassNumber, setFoundClassNumber] =
    useState<ClassNumberEntity | null>(null);

  const entityDetails = useEntityDetails<ClassNumberEntity>();

  const fetchClassNumbers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ClassNumberService.getAll(0, 100);
      setClassNumbers(unwrapApiResponse(data));
    } catch {
      setError("Помилка завантаження номерів занять");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassNumbers();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...newClassNumber,
        number: Number(newClassNumber.number),
        time_start: toIsoTime(
          String(newClassNumber.time_start ?? "").slice(0, 5)
        ),
        time_end: toIsoTime(
          String(newClassNumber.time_end ?? "").slice(0, 5)
        ),
      };
      if (editingId !== null) {
        await ClassNumberService.update({ ...payload, id: editingId });
      } else {
        await ClassNumberService.create(payload);
      }
      setNewClassNumber(emptyClassNumber);
      setEditingId(null);
      await fetchClassNumbers();
    } catch {
      setError(
        editingId !== null
          ? "Помилка оновлення номера заняття"
          : "Помилка створення номера заняття"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await ClassNumberService.delete(id);
      await fetchClassNumbers();
    } catch {
      setError("Помилка видалення номера заняття");
    } finally {
      setLoading(false);
    }
  };

  const handleFind = async () => {
    setLoading(true);
    setError(null);
    setFoundClassNumber(null);
    try {
      let data: ClassNumberEntity | null = null;
      if (searchType === "id") {
        data = await ClassNumberService.getById(Number(findId));
      } else if (searchType === "number") {
        const all = await ClassNumberService.getAll(0, 100);
        const arr = unwrapApiResponse(all);
        data = arr.find((d) => String(d.number) === findNumber) ?? null;
      }
      setFoundClassNumber(data);
    } catch {
      setError("Не знайдено");
    } finally {
      setLoading(false);
    }
  };

  const tableData = useMemo(() => {
    if (tableMode === "all") return classNumbers;
    if (!foundClassNumber) return [];
    if (Array.isArray(foundClassNumber)) return foundClassNumber;
    return [foundClassNumber];
  }, [tableMode, classNumbers, foundClassNumber]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        color="text.primary"
        align="center"
        sx={{ mb: 3 }}
      >
        Адміністрування номерів занять
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Створити/оновити номер заняття</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <TextField
            label="Номер"
            value={newClassNumber.number}
            onChange={(e) =>
              setNewClassNumber({ ...newClassNumber, number: e.target.value })
            }
            size="small"
            type="number"
            fullWidth
            sx={{ minWidth: 120, flex: "1 1 120px" }}
          />
          <TextField
            label="Час початку"
            type="time"
            value={formatTimeToHHMM(newClassNumber.time_start)}
            onChange={(e) =>
              setNewClassNumber({
                ...newClassNumber,
                time_start: formatTimeForSend(e.target.value),
              })
            }
            size="small"
            fullWidth
            sx={{ minWidth: 120, flex: "1 1 120px" }}
            InputLabelProps={{ shrink: true }}
            slotProps={{
              htmlInput: { step: 1 },
            }}
          />
          <TextField
            label="Час завершення"
            type="time"
            value={formatTimeToHHMM(newClassNumber.time_end)}
            onChange={(e) =>
              setNewClassNumber({
                ...newClassNumber,
                time_end: formatTimeForSend(e.target.value),
              })
            }
            size="small"
            fullWidth
            sx={{ minWidth: 120, flex: "1 1 120px" }}
            InputLabelProps={{ shrink: true }}
            slotProps={{
              htmlInput: { step: 1 },
            }}
          />
        </Box>
        <Button variant="contained" onClick={handleSave} sx={{ mt: 2, mr: 2 }}>
          {editingId !== null ? "Зберегти зміни" : "Створити номер заняття"}
        </Button>
        {editingId !== null && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setNewClassNumber(emptyClassNumber);
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
              <MenuItem value="all">Всі номери занять</MenuItem>
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
                  onChange={(e) => setSearchType(e.target.value as "id" | "number")}
                >
                  <MenuItem value="id">За ID</MenuItem>
                  <MenuItem value="number">За номером</MenuItem>
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
              {searchType === "number" && (
                <TextField
                  label="Номер"
                  value={findNumber}
                  onChange={(e) => setFindNumber(e.target.value)}
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
          {tableMode === "all" ? "Всі номери занять" : "Результати пошуку"}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Номер</TableCell>
              <TableCell>Час початку</TableCell>
              <TableCell>Час завершення</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((classNumber) => (
              <TableRow key={classNumber.id}>
                <TableCell>
                  <span
                    style={{
                      color: "#1976d2",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() =>
                      entityDetails.showDetails(
                        "Номер заняття",
                        ClassNumberService,
                        classNumber.id
                      )
                    }
                  >
                    {classNumber.id}
                  </span>
                </TableCell>
                <TableCell>{classNumber.number}</TableCell>
                <TableCell>
                  {formatTimeToHHMM(classNumber.time_start)}
                </TableCell>
                <TableCell>
                  {formatTimeToHHMM(classNumber.time_end)}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setNewClassNumber({
                        ...emptyClassNumber,
                        ...classNumber,
                      });
                      setEditingId(classNumber.id);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Оновити
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleDelete(classNumber.id)}
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

export default ClassNumberAdmin;
