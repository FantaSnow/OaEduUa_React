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
import RoleService from "@/api/services/RoleService";
import { useEntityDetails } from "@/hooks/useEntityDetails";
import { unwrapApiResponse } from "@/types/api.types";
import type { Role } from "@/types/entities";

const emptyRole = {
  id: 0,
  name: "",
};

type RoleField = keyof typeof emptyRole;

const RoleAdmin: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newRole, setNewRole] =
    useState<Record<RoleField, string | number>>(emptyRole);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [tableMode, setTableMode] = useState<"all" | "search">("all");
  const [searchType, setSearchType] = useState<"id" | "name">("id");
  const [findId, setFindId] = useState("");
  const [findName, setFindName] = useState("");
  const [foundRole, setFoundRole] = useState<Role | null>(null);

  const entityDetails = useEntityDetails<Role>();

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await RoleService.getAll(0, 100);
      setRoles(unwrapApiResponse(data));
    } catch {
      setError("Помилка завантаження ролей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      if (editingId !== null) {
        await RoleService.update({
          id: editingId,
          name: String(newRole.name),
        });
      } else {
        await RoleService.create({ name: String(newRole.name) });
      }
      setNewRole(emptyRole);
      setEditingId(null);
      await fetchRoles();
    } catch {
      setError(
        editingId !== null ? "Помилка оновлення ролі" : "Помилка створення ролі"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await RoleService.delete(id);
      await fetchRoles();
    } catch {
      setError("Помилка видалення ролі");
    } finally {
      setLoading(false);
    }
  };

  const handleFind = async () => {
    setLoading(true);
    setError(null);
    setFoundRole(null);
    try {
      let data = null;
      if (searchType === "id") {
        data = await RoleService.getById(Number(findId));
      } else if (searchType === "name") {
        data = await RoleService.getByName(findName);
      }
      setFoundRole(data);
    } catch {
      setError("Не знайдено");
    } finally {
      setLoading(false);
    }
  };

  const tableData = useMemo(() => {
    if (tableMode === "all") return roles;
    if (!foundRole) return [];
    if (Array.isArray(foundRole)) return foundRole;
    return [foundRole];
  }, [tableMode, roles, foundRole]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        color="text.primary"
        align="center"
        sx={{ mb: 3 }}
      >
        Адміністрування ролей
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Створити/оновити роль</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <TextField
            label="Назва"
            value={newRole.name}
            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
            size="small"
            fullWidth
            sx={{ minWidth: 200, flex: "1 1 200px" }}
          />
        </Box>
        <Button variant="contained" onClick={handleSave} sx={{ mt: 2, mr: 2 }}>
          {editingId !== null ? "Зберегти зміни" : "Створити роль"}
        </Button>
        {editingId !== null && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setNewRole(emptyRole);
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
              <MenuItem value="all">Всі ролі</MenuItem>
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
          {tableMode === "all" ? "Всі ролі" : "Результати пошуку"}
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
            {tableData.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <span
                    style={{
                      color: "#1976d2",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() =>
                      entityDetails.showDetails("Роль", RoleService, role.id)
                    }
                  >
                    {role.id}
                  </span>
                </TableCell>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setNewRole({ ...emptyRole, ...role });
                      setEditingId(role.id);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Оновити
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleDelete(role.id)}
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

export default RoleAdmin;
