import { ref } from "vue";

export type Theme = "dark" | "light";

const THEME_KEY = "yunnote.theme";

function loadTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

const theme = ref<Theme>(loadTheme());

function applyTheme(): void {
  document.documentElement.setAttribute("data-theme", theme.value);
}

export function useTheme() {
  function initTheme(): void {
    applyTheme();
  }

  function toggleTheme(): void {
    theme.value = theme.value === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, theme.value);
    } catch {
      /* 忽略存储失败 */
    }
    applyTheme();
  }

  return { theme, toggleTheme, initTheme };
}