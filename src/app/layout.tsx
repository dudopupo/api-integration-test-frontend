import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Bet App",
  description: "Bet App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className='bg-red-100'
      >
        {children}
      </body>
    </html>
  );
}
