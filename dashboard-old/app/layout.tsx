import { ThemeModeScript, ThemeProvider } from "flowbite-react";
import { customTheme, applyTheme } from "./theme";

import "./globals.css";

export const metadata = {
  title: "CRM Dashboard",
  description: "CRM Dashboard for managing customers and invoices",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900">
        <ThemeProvider theme={customTheme} applyTheme={applyTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
