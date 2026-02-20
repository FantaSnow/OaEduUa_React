import type { ScheduleLesson } from "@/types/entities";

export const weekDays = [
  "Понеділок",
  "Вівторок",
  "Середа",
  "Четвер",
  "Пʼятниця",
  "Субота",
  "Неділя",
];

export const tableHeaders: Array<{
  key: string;
  label: string;
  render: (row: ScheduleLesson) => string;
}> = [
  {
    key: "pair",
    label: "Пара",
    render: (row) => row.classnumber?.number ?? "",
  },
  {
    key: "time",
    label: "Час",
    render: (row) =>
      row.classnumber
        ? `${row.classnumber.time_start} - ${row.classnumber.time_end}`
        : "",
  },
  {
    key: "subject",
    label: "Дисципліна",
    render: (row) => row.subject?.name ?? "",
  },
  {
    key: "auditory",
    label: "Аудиторія",
    render: (row) => row.auditory ?? "",
  },
  {
    key: "type",
    label: "Тип",
    render: (row) => row.class_type?.name ?? "",
  },
  {
    key: "teacher",
    label: "Викладач",
    render: (row) => row.teacher?.name ?? "",
  },
  {
    key: "group",
    label: "Група",
    render: (row) => row.group?.name ?? "",
  },
  {
    key: "code",
    label: "Кодове слово",
    render: (row) =>
      row.teacher?.connectionCode ?? row.connectionCode ?? "",
  },
];
