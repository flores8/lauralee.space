'use client';

import { useState, useEffect, useRef } from 'react';

type ThemeMode = 'system' | 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const themeRef = useRef<ThemeMode>('system');

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial system theme
    setSystemTheme(prefersDark ? 'dark' : 'light');
    
    // Set initial theme - if no saved theme, default to system
    const initialTheme = savedTheme || 'system';
    setTheme(initialTheme);
    themeRef.current = initialTheme;
    
    // Apply theme - only use system preference if theme is 'system'
    if (initialTheme === 'system') {
      applyTheme('system', prefersDark);
    } else {
      applyTheme(initialTheme, false); // Force the saved theme regardless of system
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
      
      // Only update if current theme is 'system'
      if (themeRef.current === 'system') {
        applyTheme('system', e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const applyTheme = (themeMode: ThemeMode, systemPrefersDark: boolean) => {
    const shouldBeDark = themeMode === 'dark' || (themeMode === 'system' && systemPrefersDark);
    
    // Set data-theme attribute to override media query
    if (themeMode === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeMode);
    }
    
    if (shouldBeDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  const selectTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    themeRef.current = newTheme;
    localStorage.setItem('theme', newTheme);
    
    // Apply theme - only use system preference if theme is 'system'
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme('system', prefersDark);
    } else {
      applyTheme(newTheme, false); // Force the selected theme regardless of system
    }
  };

  const isActive = (mode: ThemeMode) => {
    if (mode === 'system') {
      return theme === 'system';
    }
    return theme === mode;
  };

  return (
    <div className="theme-toggle">
      <button 
        onClick={() => selectTheme('light')}
        className={`theme-option ${isActive('light') ? 'active' : ''}`}
        aria-label="Switch to light mode"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      </button>
      <button 
        onClick={() => selectTheme('dark')}
        className={`theme-option ${isActive('dark') ? 'active' : ''}`}
        aria-label="Switch to dark mode"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
      <button 
        onClick={() => selectTheme('system')}
        className={`theme-option ${theme === 'system' ? 'active' : ''}`}
        aria-label="Switch to system default"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      </button>
    </div>
  );
} 