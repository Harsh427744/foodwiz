import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FoodWiz',
  description: 'FoodWiz – SHIELD food ordering',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">{children}</body>
    </html>
  );
}
