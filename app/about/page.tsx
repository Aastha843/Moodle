'use client';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cookies from 'js-cookie';

export default function About() {
  const studentNumber = '21775745';
  const studentName = 'Aastha Acharya';
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = Cookies.get('darkMode') === 'true';
    setDarkMode(savedMode);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    Cookies.set('darkMode', String(!darkMode));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: darkMode ? '#222' : '#fff', color: darkMode ? '#fff' : '#000' }}>
      <Header studentNumber={studentNumber} />
      <main style={{ padding: 20 }}>
        <h1>About Me</h1>
        <p>Name: {studentName}</p>
        <p>Student Number: {studentNumber}</p>
        <video controls style={{ width: '50%', marginTop: '20px' }}>
          <source src="/VIDEO.mp4" type="video/mp4" />
        </video>
      </main>
      <Footer studentName={studentName} studentNumber={studentNumber} />
    </div>
  );
}
