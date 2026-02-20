"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ScheduleLesson } from "@/types/entities";
import ScheduleService from "@/api/services/ScheduleService";
import { tableHeaders } from "./constants";
import { getMonday, getWeekDates } from "./utils/schedule";
import ScheduleTable from "./components/ScheduleTable";
import ScheduleFilters from "./components/ScheduleFilters";
import ScheduleNavigation from "./components/ScheduleNavigation";
import ScheduleDays from "./components/ScheduleDays";

const toApiDate = (date: Date) =>
  date.getFullYear() +
  "-" +
  String(date.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(date.getDate()).padStart(2, "0");

const SchedulePage: React.FC = () => {
  const theme = useTheme();

  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const [activeDay, setActiveDay] = useState(
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  );
  const [activeColumns, setActiveColumns] = useState<string[]>(
    tableHeaders.map((h) => h.key)
  );
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleLesson[]>([]);

  const weekDates = useMemo(() => getWeekDates(currentMonday), [currentMonday]);
  const selectedDate = useMemo(
    () => weekDates[activeDay],
    [weekDates, activeDay]
  );

  const lastFetchedDate = useRef<string | null>(null);

  const fetchSchedule = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const dateStr = toApiDate(date);
      const res = await ScheduleService.getByGroup(dateStr, dateStr);
      setSchedule(Array.isArray(res) ? res : []);
    } catch (e) {
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = toApiDate(selectedDate);
      if (lastFetchedDate.current !== dateStr) {
        lastFetchedDate.current = dateStr;
        fetchSchedule(selectedDate);
      }
    }
  }, [selectedDate, fetchSchedule]);

  const handleDayClick = useCallback((idx: number) => setActiveDay(idx), []);

  const handleToggleColumn = useCallback((key: string) => {
    setActiveColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  }, []);

  const allPairs = useMemo(() => {
    const maxPair = schedule.length
      ? Math.max(
          ...schedule.map((l) => Number(l.classnumber?.number ?? 0)),
          0
        )
      : 0;
    return Array.from({ length: maxPair }, (_, i) => i + 1);
  }, [schedule]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Завантаження...
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <ScheduleNavigation
        weekDates={weekDates}
        currentMonday={currentMonday}
        setCurrentMonday={setCurrentMonday}
        setActiveDay={setActiveDay}
        theme={theme}
      />
      <ScheduleDays
        weekDates={weekDates}
        activeDay={activeDay}
        setActiveDay={handleDayClick}
        theme={theme}
      />
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <ScheduleTable
          loading={loading}
          allPairs={allPairs}
          lessons={schedule}
          activeColumns={activeColumns}
          theme={theme}
        />
      </Box>
      <ScheduleFilters
        activeColumns={activeColumns}
        handleToggleColumn={handleToggleColumn}
        theme={theme}
      />
    </Box>
  );
};

export default SchedulePage;

