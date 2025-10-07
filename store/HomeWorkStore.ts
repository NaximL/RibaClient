import { create } from 'zustand';

// Тип однієї домашки
export type HomeworkItem = {
  Id: string;
  Dalykas?: string;              // Назва предмета
  UzduotiesAprasymas?: string;   // Опис завдання
  PamokosData?: string;          // Дата уроку
  AtliktiIki?: string;           // Термін виконання
  [key: string]: any;            // На випадок, якщо API повертає ще щось
};

// Тип для всіх днів: сьогодні (0), завтра (1), післязавтра (2)
export type HomeworkByDay = {
  0: HomeworkItem[];
  1: HomeworkItem[];
  2: HomeworkItem[];
};

// Тип для Zustand store
type HomeWorkStore = {
  HomeWork: HomeworkByDay;
  SetHomeWork: (home: HomeworkByDay) => void;
};

// Ініціалізація Zustand store
export const useHomeWorkStore = create<HomeWorkStore>((set) => ({
  HomeWork: { 0: [], 1: [], 2: [] },
  SetHomeWork: (home) => set({ HomeWork: home }),
}));

export default useHomeWorkStore;