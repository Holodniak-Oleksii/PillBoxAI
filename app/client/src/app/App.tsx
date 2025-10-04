import { ThemeProvider } from "@/app/providers/theme/ThemeProvider";
import AppRouter from "@/app/router/AppRouter";

export const App = () => (
  <ThemeProvider>
    <AppRouter />
  </ThemeProvider>
);
