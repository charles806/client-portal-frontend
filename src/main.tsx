import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import App from "./app/App.tsx";
import "./styles/index.css";
import { useThemeStore } from "./store/themeStore.ts";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);
