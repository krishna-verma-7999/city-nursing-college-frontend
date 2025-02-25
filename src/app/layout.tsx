import AuthWrapper from "@/components/layout/authWrapper";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={`"h-screen w-full ${inter.className}`}>
        <AuthWrapper>
          {children}
          <Toaster />
        </AuthWrapper>
      </body>
    </html>
  );
}
