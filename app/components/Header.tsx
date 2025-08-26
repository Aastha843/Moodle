'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

interface HeaderProps {
  studentNumber: string;
}

export default function Header({ studentNumber }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('/');
  const [menuOpen, setMenuOpen] = useState(false);

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Escape Room', path: '/escape-room' },
    { name: 'Coding Races', path: '/coding-races' },
    { name: 'Court Room', path: '/court-room' },
    { name: 'Tabs Page', path: '/tabpage' },
  ];

  useEffect(() => {
    const savedMode = Cookies.get('darkMode') === 'true';
    const savedTab = Cookies.get('activeTab') || '/';
    setDarkMode(savedMode);
    setActiveTab(savedTab);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    Cookies.set('darkMode', String(!darkMode));
  };

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    Cookies.set('activeTab', tab);
    setMenuOpen(false);
  };

  const linkStyle = (tab: string) => ({
    padding: '5px 10px',
    margin: '0 5px',
    borderRadius: '4px',
    textDecoration: 'none',
    color: darkMode ? '#fff' : '#000',
    backgroundColor: activeTab === tab ? (darkMode ? '#555' : '#ccc') : 'transparent',
  });

  return (
    <header
      style={{
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: darkMode ? '#333' : '#eee',
        color: darkMode ? '#fff' : '#000',
        position: 'relative',
      }}
    >
      {/* Student Number on left */}
      <div>{studentNumber}</div>

      {/* Top Navigation Bar */}
      <nav style={{ display: 'flex', gap: '5px' }}>
        {pages.map((page) => (
          <Link
            key={page.path}
            href={page.path}
            onClick={() => changeTab(page.path)}
            style={linkStyle(page.path)}
          >
            {page.name}
          </Link>
        ))}
      </nav>

      {/* Right side buttons: Hamburger + Dark Mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Dark Mode Button */}
        <button
          onClick={toggleDarkMode}
          style={{ padding: '5px 10px', cursor: 'pointer' }}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Hamburger Menu */}
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ fontSize: '24px', cursor: 'pointer', userSelect: 'none' }}
        >
          ☰
        </div>
      </div>

      {/* Hamburger Dropdown */}
      {menuOpen && (
        <nav
          style={{
            position: 'absolute',
            top: '50px',
            right: '20px',
            backgroundColor: darkMode ? '#333' : '#eee',
            padding: '10px',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          {pages.map((page) => (
            <Link
              key={page.path + '-mobile'}
              href={page.path}
              onClick={() => changeTab(page.path)}
              style={linkStyle(page.path)}
            >
              {page.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
