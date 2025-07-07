// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'lauralee.space',
  description: 'A personal playground for writing, reading, and creative experiments.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="p-6 border-b">
          <nav className="flex gap-6 text-sm">
            <a href="/">Home</a>
            <a href="/writing">Writing</a>
            <a href="/reading">Reading</a>
            <a href="/projects">Projects</a>
          </nav>
        </header>
        <main className="p-6 max-w-2xl mx-auto">{children}</main>
        <footer className="p-6 text-xs text-center text-gray-500">© {new Date().getFullYear()} Lauralee Flores</footer>
      </body>
    </html>
  );
}
