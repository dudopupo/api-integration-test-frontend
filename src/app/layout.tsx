import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './provider';


export const metadata: Metadata = {
  title: 'Auth Example',
  description: 'Authentication example with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}