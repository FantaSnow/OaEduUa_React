import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { AuthProvider } from "@/providers/AuthContext";
import { ThemeProvider } from "@/providers/theme/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "OaEdu – Освітня платформа Острозької академії",
    template: "%s | OaEdu",
  },
  description:
    "Онлайн-платформа Острозької академії: розклад занять, новини, волонтерські можливості та адмінпанель для управління навчальним процесом.",
  openGraph: {
    title: "OaEdu – Освітня платформа Острозької академії",
    description:
      "Актуальний розклад, новини університету, можливості волонтерства та інструменти для адміністрування.",
    url: "https://example.com",
    siteName: "OaEdu",
    locale: "uk_UA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>
        <AppRouterCacheProvider>
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
