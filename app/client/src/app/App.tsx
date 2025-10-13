import { ModalProvider } from "@/app/providers/modals/ModalProvider";
import { ThemeProvider } from "@/app/providers/theme/ThemeProvider";
import AppRouter from "@/app/router/AppRouter";

export const App = () => (
  <ThemeProvider>
    <ModalProvider>
      <AppRouter />
    </ModalProvider>
  </ThemeProvider>
);
