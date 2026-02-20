/**
 * Номер заняття (пара).
 */
export interface ClassNumber {
  number: string;
  time_start: string;
  time_end: string;
}

/**
 * Предмет/дисципліна.
 */
export interface Subject {
  name: string;
}

/**
 * Викладач.
 */
export interface Teacher {
  name: string;
  connectionCode?: string;
}

/**
 * Група.
 */
export interface Group {
  name: string;
}

/**
 * Тип заняття (лекція, практична, лабораторна).
 */
export interface ClassType {
  name: string;
}

/**
 * Один елемент розкладу (пара).
 */
export interface ScheduleLesson {
  id?: number;
  date?: string;
  auditory?: string;
  classnumber?: ClassNumber;
  subject?: Subject;
  class_type?: ClassType;
  teacher?: Teacher;
  group?: Group;
  connectionCode?: string;
}
