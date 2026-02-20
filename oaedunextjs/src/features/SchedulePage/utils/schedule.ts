export const getMonday = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay() || 7;
  if (day !== 1) d.setDate(d.getDate() - (day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
};

export const formatDate = (date: Date) =>
  date.toLocaleDateString("uk-UA").replace(/\//g, ".");

export const getWeekDates = (monday: Date) =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

import type { Theme } from "@mui/material/styles";

export const getRowColor = (type: string, theme: Theme) => {
  if (!theme?.palette?.schedule) return "transparent";
  if (type === "Лекція") return theme.palette.schedule.lecture;
  if (type === "Лабораторна") return theme.palette.schedule.Lab;
  if (type === "Практична") return theme.palette.schedule.Prac;
  return "transparent";
};
