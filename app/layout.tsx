// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import ThemeToggle from './components/ThemeToggle';
import Navigation from './components/Navigation';

export const metadata: Metadata = {
  title: 'lauralee.space',
  description: 'A personal playground for writing, reading, and creative experiments.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Navigation />
          <ThemeToggle />
        </header>
        <main className="site-main">{children}</main>
        <footer className="site-footer">© {new Date().getFullYear()} Lauralee Flores</footer>
      </body>
    </html>
  );
}
