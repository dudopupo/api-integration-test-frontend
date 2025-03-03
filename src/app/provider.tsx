"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notification } from "@/shared/components/Notifycation/Notifycation";

const queryClient = new QueryClient();
const theme = createTheme();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <Notification />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
