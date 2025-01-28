import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "City Nursing College",
  description: "ERP",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex justify-center items-center h-screen w-full">
      {children}
    </main>
  );
}
