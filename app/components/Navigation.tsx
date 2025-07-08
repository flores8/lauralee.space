'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/writing', label: 'Writing' },
    { href: '/reading', label: 'Reading' },
    { href: '/projects', label: 'Projects' },
  ];

  return (
    <nav className="site-nav">
      {navItems.map((item) => {
        // For the home page, exact match
        // For other pages, check if pathname starts with the href
        const isActive = item.href === '/' 
          ? pathname === item.href 
          : pathname.startsWith(item.href);
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
} 