'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

type HeaderProps = {
  studentNumber?: string;
  studentName?: string;
};

const LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Coding Races', href: '/codingraces' },
  { name: 'Escape Room', href: '/escaperoom' },
  { name: 'Tabs Page', href: '/tabpage' },
  { name: 'Court Room', href: '/courtroom' },
];

export default function Header({
  studentNumber = '21775745',
  studentName = 'Aastha Acharya',
}: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState('/');

  useEffect(() => {

    const saved = localStorage.getItem('theme');
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const shouldDark = saved ? saved === 'dark' : prefersDark;
    setDark(shouldDark);
    document.documentElement.classList.toggle('dark', shouldDark);

    // nav state
    const savedTab = Cookies.get('activeTab');
    setActive(savedTab || pathname || '/');
  }, [pathname]);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  function handleClick(href: string) {
    setActive(href);
    Cookies.set('activeTab', href, { expires: 7 });
    setMenuOpen(false);
  }

  const linkClass = (href: string) =>
    `nav-link ${pathname === href || active === href ? 'nav-link--active' : ''}`;

  return (
    <header className="header" role="banner">
     
      <div className="header__left" aria-live="polite">
        <strong>{studentName}</strong> · ID: <strong>{studentNumber}</strong>
      </div>

  
      <nav aria-label="Main" className="nav nav--desktop">
        {LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={linkClass(item.href)}
            onClick={() => handleClick(item.href)}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      
      <div className="header__actions">
        <button
          type="button"
          onClick={toggleTheme}
          className="btn"
          aria-pressed={dark}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {dark ? 'Light' : 'Dark'}
        </button>

        <button
          type="button"
          className="btn btn--icon nav__hamburger"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      
      {menuOpen && (
        <nav id="mobile-menu" aria-label="Mobile" className="nav nav--mobile">
          {LINKS.map((item) => (
            <Link
              key={item.href + '-m'}
              href={item.href}
              className={linkClass(item.href)}
              onClick={() => handleClick(item.href)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
