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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ScheduleService from "@/api/services/ScheduleService";
import SubjectService from "@/api/services/SubjectService";
import GroupService from "@/api/services/GroupService";
import TeacherService from "@/api/services/TeacherService";
import ClassTypeService from "@/api/services/ClassTypeService";
import ClassNumberService from "@/api/services/ClassNumberService";
import { useEntityDetails } from "@/hooks/useEntityDetails";
import { unwrapApiResponse } from "@/types/api.types";
import type {
  ScheduleAdminItem,
  ScheduleLesson,
  SubjectEntity,
  GroupEntity,
  TeacherEntity,
  ClassTypeEntity,
  ClassNumberEntity,
} from "@/types/entities";

const emptySchedule = {
  id: 0,
  date: "",
  auditory: "",
  connectionCode: "",
  subject_id: "",
  teacher_id: "",
  group_id: "",
  class_type: "",
  class_number_id: "",
};

type ScheduleField = keyof typeof emptySchedule;

const SchedulesAdmin: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleAdminItem[]>(
    [] as ScheduleAdminItem[]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSchedule, setNewSchedule] =
    useState<Record<ScheduleField, string | number>>(emptySchedule);
  const [findId, setFindId] = useState("");
  const [foundSchedule, setFoundSchedule] = useState<ScheduleAdminItem | ScheduleLesson | ScheduleLesson[] | null>(null);
  const [searchType, setSearchType] = useState<"id" | "subject" | "date">("id");
  const [subjectName, setSubjectName] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [tableMode, setTableMode] = useState<"all" | "search">("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<SubjectEntity[]>([]);
  const [groups, setGroups] = useState<GroupEntity[]>([]);
  const [teachers, setTeachers] = useState<TeacherEntity[]>([]);
  const [classTypes, setClassTypes] = useState<ClassTypeEntity[]>([]);
  const [classNumbers, setClassNumbers] = useState<ClassNumberEntity[]>([]);

  const entityDetails = useEntityDetails<unknown>();

  useEffect(() => {
    SubjectService.getAll(0, 100).then((res) =>
      setSubjects(unwrapApiResponse(res))
    );
    GroupService.getAll(0, 100).then((res) =>
      setGroups(unwrapApiResponse(res))
    );
    TeacherService.getAll(0, 100).then((res) =>
      setTeachers(unwrapApiResponse(res))
    );
    ClassTypeService.getAll(0, 100).then((res) =>
      setClassTypes(unwrapApiResponse(res))
    );
    ClassNumberService.getAll(0, 100).then((res) =>
      setClassNumbers(unwrapApiResponse(res))
    );
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ScheduleService.getAll(0, 100);
      const items = unwrapApiResponse(data);
      setSchedules((items as ScheduleAdminItem[]));
    } catch {
      setError("Помилка завантаження розкладів");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  function toId(val: unknown): number {
    if (val === "" || val == null) return 0;
    const n = Number(val);
    return Number.isNaN(n) ? 0 : n;
  }

  function cleanSchedulePayload(
    schedule: ScheduleAdminItem | ScheduleLesson | Record<string, string | number>
  ): Record<string, number | string> {
    const s = schedule as Record<string, unknown>;
    const classType =
      (s.class_type_id as number | undefined) ??
      (typeof s.class_type === "number" ? s.class_type : undefined);
    return {
      id: (s.id as number | undefined) ?? 0,
      date: String(s.date ?? "").trim(),
      auditory: String(s.auditory ?? "").trim(),
      connectionCode: String(s.connectionCode ?? "").trim(),
      subject_id: toId(s.subject_id),
      group_id: toId(s.group_id),
      teacher_id: toId(s.teacher_id),
      class_type: toId(classType),
      class_number_id: toId(s.class_number_id),
    };
  }

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = cleanSchedulePayload(newSchedule);
      if (editingId !== null) {
        await ScheduleService.update({ ...payload, id: editingId });
      } else {
        await ScheduleService.create(payload);
      }
      setNewSchedule(emptySchedule);
      setEditingId(null);
      fetchSchedules();
    } catch {
      setError(
        editingId !== null
          ? "Помилка оновлення розкладу"
          : "Помилка створення розкладу"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await ScheduleService.delete(id);
      fetchSchedules();
    } catch {
      setError("Помилка видалення розкладу");
    } finally {
      setLoading(false);
    }
  };

  const handleFind = async () => {
    setLoading(true);
    setError(null);
    setFoundSchedule(null);
    try {
      let data = null;
      if (searchType === "id") {
        data = await ScheduleService.getById(Number(findId));
      } else if (searchType === "subject") {
        data = await ScheduleService.getBySubjectName(
          subjectName,
          dateStart,
          dateEnd
        );
      } else if (searchType === "date") {
        data = await ScheduleService.getByDates(dateStart, dateEnd);
      }
      setFoundSchedule(data as ScheduleAdminItem | ScheduleLesson | ScheduleLesson[] | null);
    } catch {
      setError("Не знайдено");
    } finally {
      setLoading(false);
    }
  };

  const tableData = useMemo(() => {
    if (tableMode === "all") return schedules;
    if (!foundSchedule) return [];
    if (Array.isArray(foundSchedule)) return foundSchedule;
    return [foundSchedule];
  }, [tableMode, schedules, foundSchedule]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" color="text.primary" align="center" sx={{ mb: 3 }}>
        Адміністрування розкладів
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Створити/оновити розклад</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <TextField
            label="Дата"
            type="date"
            value={newSchedule.date}
            onChange={(e) =>
              setNewSchedule({ ...newSchedule, date: e.target.value })
            }
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200, flex: "1 1 200px" }}
          />
          <TextField
            label="Аудиторія"
            value={newSchedule.auditory}
            onChange={(e) =>
              setNewSchedule({ ...newSchedule, auditory: e.target.value })
            }
            size="small"
            fullWidth
            sx={{ minWidth: 200, flex: "1 1 200px" }}
          />
          <TextField
            label="Код підключення"
            value={newSchedule.connectionCode}
            onChange={(e) =>
              setNewSchedule({ ...newSchedule, connectionCode: e.target.value })
            }
            size="small"
            fullWidth
            sx={{ minWidth: 200, flex: "1 1 200px" }}
          />
          <FormControl fullWidth size="small" sx={{ minWidth: 200, flex: "1 1 200px" }}>
            <InputLabel>Предмет</InputLabel>
            <Select
              value={
                newSchedule.subject_id === "" || newSchedule.subject_id == null
                  ? ""
                  : String(newSchedule.subject_id)
              }
              label="Предмет"
              onChange={(e) =>
                setNewSchedule({
                  ...newSchedule,
                  subject_id: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            >
              <MenuItem value="">— не обрано —</MenuItem>
              {subjects.map((s) => (
                <MenuItem key={s.id} value={String(s.id)}>
                  {s.name} (id: {s.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" sx={{ minWidth: 200, flex: "1 1 200px" }}>
            <InputLabel>Група</InputLabel>
            <Select
              value={
                newSchedule.group_id === "" || newSchedule.group_id == null
                  ? ""
                  : String(newSchedule.group_id)
              }
              label="Група"
              onChange={(e) =>
                setNewSchedule({
                  ...newSchedule,
                  group_id: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            >
              <MenuItem value="">— не обрано —</MenuItem>
              {groups.map((g) => (
                <MenuItem key={g.id} value={String(g.id)}>
                  {g.name} (id: {g.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" sx={{ minWidth: 200, flex: "1 1 200px" }}>
            <InputLabel>Викладач</InputLabel>
            <Select
              value={
                newSchedule.teacher_id === "" || newSchedule.teacher_id == null
                  ? ""
                  : String(newSchedule.teacher_id)
              }
              label="Викладач"
              onChange={(e) =>
                setNewSchedule({
                  ...newSchedule,
                  teacher_id: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            >
              <MenuItem value="">— не обрано —</MenuItem>
              {teachers.map((t) => (
                <MenuItem key={t.id} value={String(t.id)}>
                  {t.name} (id: {t.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" sx={{ minWidth: 200, flex: "1 1 200px" }}>
            <InputLabel>Тип заняття</InputLabel>
            <Select
              value={
                newSchedule.class_type === "" || newSchedule.class_type == null
                  ? ""
                  : String(newSchedule.class_type)
              }
              label="Тип заняття"
              onChange={(e) =>
                setNewSchedule({
                  ...newSchedule,
                  class_type: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            >
              <MenuItem value="">— не обрано —</MenuItem>
              {classTypes.map((ct) => (
                <MenuItem key={ct.id} value={String(ct.id)}>
                  {ct.name} (id: {ct.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small" sx={{ minWidth: 200, flex: "1 1 200px" }}>
            <InputLabel>Пара</InputLabel>
            <Select
              value={
                newSchedule.class_number_id === "" ||
                newSchedule.class_number_id == null
                  ? ""
                  : String(newSchedule.class_number_id)
              }
              label="Пара"
              onChange={(e) =>
                setNewSchedule({
                  ...newSchedule,
                  class_number_id:
                    e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            >
              <MenuItem value="">— не обрано —</MenuItem>
              {classNumbers.map((cn) => (
                <MenuItem key={cn.id} value={String(cn.id)}>
                  {cn.number} ({cn.time_start}-{cn.time_end}) id: {cn.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" onClick={handleSave} sx={{ mt: 2, mr: 2 }}>
          {editingId !== null ? "Зберегти зміни" : "Створити розклад"}
        </Button>
        {editingId !== null && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setNewSchedule(emptySchedule);
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
              <MenuItem value="all">Всі розклади</MenuItem>
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
                  onChange={(e) => setSearchType(e.target.value as "id" | "subject" | "date")}
                >
                  <MenuItem value="id">За ID</MenuItem>
                  <MenuItem value="subject">За назвою предмета</MenuItem>
                  <MenuItem value="date">За датою</MenuItem>
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
              {searchType === "subject" && (
                <>
                  <TextField
                    label="Назва предмета"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    size="small"
                    sx={{ mr: 2 }}
                  />
                  <TextField
                    label="Дата початку"
                    type="date"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    size="small"
                    sx={{ mr: 2 }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Дата кінця"
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    size="small"
                    sx={{ mr: 2 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}
              {searchType === "date" && (
                <>
                  <TextField
                    label="Дата початку"
                    type="date"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    size="small"
                    sx={{ mr: 2 }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Дата кінця"
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    size="small"
                    sx={{ mr: 2 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}
              <Button variant="outlined" onClick={handleFind} sx={{ ml: 2 }}>
                Знайти
              </Button>
            </>
          )}
        </Box>

        <Typography variant="h6" sx={{ mb: 1 }}>
          {tableMode === "all" ? "Всі розклади" : "Результати пошуку"}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Аудиторія</TableCell>
              <TableCell>Код підключення</TableCell>
              <TableCell>Група</TableCell>
              <TableCell>Предмет</TableCell>
              <TableCell>Тип заняття</TableCell>
              <TableCell>Викладач</TableCell>
              <TableCell>Пара</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((schedule, idx) => (
              <TableRow key={(schedule as ScheduleAdminItem).id ?? idx}>
                <TableCell>{(schedule as ScheduleAdminItem).id}</TableCell>
                <TableCell>{(schedule as ScheduleAdminItem).date}</TableCell>
                <TableCell>{(schedule as ScheduleAdminItem).auditory}</TableCell>
                <TableCell>{schedule.connectionCode}</TableCell>
                <TableCell>
                  <span
                    style={{
                      color: "#1976d2",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      const id = (schedule as ScheduleAdminItem).group_id;
                      if (id != null)
                        entityDetails.showDetails("Група", GroupService, Number(id));
                    }}
                  >
                    {schedule.group?.name || ""}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    style={{
                      color: "#1976d2",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      const id = (schedule as ScheduleAdminItem).subject_id;
                      if (id != null)
                        entityDetails.showDetails("Предмет", SubjectService, Number(id));
                    }}
                  >
                    {schedule.subject?.name || ""}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    style={{
                      color: "#1976d2",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      const id =
                        (schedule as ScheduleAdminItem).class_type_id ??
                        (schedule as ScheduleAdminItem).class_type;
                      if (id != null)
                        entityDetails.showDetails(
                          "Тип заняття",
                          ClassTypeService,
                          Number(id)
                        );
                    }}
                  >
                    {(typeof schedule.class_type === "object"
                      ? schedule.class_type?.name
                      : (schedule as ScheduleAdminItem).class_type_obj?.name) || ""}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    style={{
                      color: "#1976d2",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      const id = (schedule as ScheduleAdminItem).teacher_id;
                      if (id != null)
                        entityDetails.showDetails("Викладач", TeacherService, Number(id));
                    }}
                  >
                    {schedule.teacher?.name || ""}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    style={{
                      color: "#1976d2",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      const id = (schedule as ScheduleAdminItem).class_number_id;
                      if (id != null)
                        entityDetails.showDetails("Пара", ClassNumberService, Number(id));
                    }}
                  >
                    {(schedule as { classnumber?: { number?: string } }).classnumber?.number || ""}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setNewSchedule({
                        ...emptySchedule,
                        ...cleanSchedulePayload(schedule),
                      } as Record<ScheduleField, string | number>);
                      setEditingId((schedule as ScheduleAdminItem).id ?? null);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Оновити
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => {
                      const id = (schedule as ScheduleAdminItem).id;
                      if (id != null) handleDelete(id);
                    }}
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

export default SchedulesAdmin;
