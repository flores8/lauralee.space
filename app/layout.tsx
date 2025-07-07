// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import ThemeToggle from './components/ThemeToggle';

export const metadata: Metadata = {
  title: 'lauralee.space',
  description: 'A personal playground for writing, reading, and creative experiments.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <nav className="site-nav">
            <Link href="/">Home</Link>
            <Link href="/writing">Writing</Link>
            <Link href="/reading">Reading</Link>
            <Link href="/projects">Projects</Link>
          </nav>
          <ThemeToggle />
        </header>
        <main className="site-main">{children}</main>
        <footer className="site-footer">© {new Date().getFullYear()} Lauralee Flores</footer>
      </body>
    </html>
  );
}
