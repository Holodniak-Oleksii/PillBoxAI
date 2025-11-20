import { InitLayout } from "@/app/layouts/InitLayout";
import { ModalProvider } from "@/app/providers/modals/ModalProvider";
import { ThemeProvider } from "@/app/providers/theme/ThemeProvider";
import AppRouter from "@/app/router/AppRouter";
import { queryClient } from "@/services";
import { QueryClientProvider } from "@tanstack/react-query";

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <InitLayout>
        <ModalProvider>
          <AppRouter />
        </ModalProvider>
      </InitLayout>
    </ThemeProvider>
  </QueryClientProvider>
);
