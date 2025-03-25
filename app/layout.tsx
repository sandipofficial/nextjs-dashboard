import "@/app/ui/global.css";
import { inter } from "./ui/fonts";
import QueryProvider from "@/contexts/QueryProvider";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}><QueryProvider>{children}</QueryProvider></body>
    </html>
  );
}
