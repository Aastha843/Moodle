'use client';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Cookies from 'js-cookie';

export default function Home() {
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

  const sampleHTML = `
<div style="padding:20px; color: red;">Hello World</div>
<script>
  console.log('Hello World');
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleHTML);
    alert('HTML + JS code copied!');
  };

  return (
    <div style={{ backgroundColor: darkMode ? '#222' : '#fff', color: darkMode ? '#fff' : '#000', minHeight: '100vh' }}>
      <Header studentNumber={studentNumber} />
      <main style={{ padding: 20 }}>
        <h1>Home Page - HTML5 + JS Generator</h1>
        <button onClick={copyToClipboard} style={{ padding: '10px', marginTop: '10px' }}>Copy HTML + JS</button>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', marginTop: '20px' }}>{sampleHTML}</pre>
      </main>
      <Footer studentName={studentName} studentNumber={studentNumber} />
    </div>
  );
}
