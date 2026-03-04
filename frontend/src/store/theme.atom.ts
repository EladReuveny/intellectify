import { atom } from "jotai";

const initialThemeValue: "light" | "dark" = localStorage.getItem("theme")
  ? (localStorage.getItem("theme") as "light" | "dark")
  : "dark";

export const themeAtom = atom<"light" | "dark">(initialThemeValue);
