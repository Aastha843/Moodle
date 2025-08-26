'use client';
import { useState, useEffect } from 'react';

interface Tab {
  id: number;
  heading: string;
  content: string;
}

export default function TabPage() {
  const initialTabs = JSON.parse(localStorage.getItem('tabs') ?? '[]');
  const [tabs, setTabs] = useState<Tab[]>(initialTabs.length ? initialTabs : [{ id: 1, heading: 'Tab 1', content: 'Content 1' }]);

  useEffect(() => {
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }, [tabs]);

  const addTab = () => {
    if (tabs.length >= 15) return;
    const newTab = { id: Date.now(), heading: `Tab ${tabs.length + 1}`, content: `Content ${tabs.length + 1}` };
    setTabs([...tabs, newTab]);
  };

  const removeTab = (id: number) => {
    setTabs(tabs.filter(tab => tab.id !== id));
  };

  const updateHeading = (id: number, value: string) => {
    setTabs(tabs.map(tab => tab.id === id ? { ...tab, heading: value } : tab));
  };

  const updateContent = (id: number, value: string) => {
    setTabs(tabs.map(tab => tab.id === id ? { ...tab, content: value } : tab));
  };

  const generateOutput = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Tabs Output</title>
</head>
<body>
  <div style="font-family: Arial, sans-serif;">
    ${tabs.map(tab => `
      <div style="border:1px solid #000; margin:10px; padding:10px;">
        <h2 style="margin:0; padding:5px; background:#ccc;">${tab.heading}</h2>
        <p style="margin:5px 0; padding:5px;">${tab.content}</p>
      </div>
    `).join('')}
  </div>
</body>
</html>
    `;
    navigator.clipboard.writeText(html);
    alert('Output HTML copied to clipboard!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Tab Page Generator</h1>
      <button onClick={addTab} style={{ marginRight: '10px' }}>+ Add Tab</button>
      <button onClick={generateOutput}>Copy Output HTML</button>
      {tabs.map(tab => (
        <div key={tab.id} style={{ border: '1px solid #333', margin: '10px 0', padding: '10px' }}>
          <input
            type="text"
            value={tab.heading}
            onChange={e => updateHeading(tab.id, e.target.value)}
            style={{ display: 'block', marginBottom: '5px', width: '100%' }}
          />
          <textarea
            value={tab.content}
            onChange={e => updateContent(tab.id, e.target.value)}
            style={{ display: 'block', width: '100%', height: '60px' }}
          />
          <button onClick={() => removeTab(tab.id)} style={{ marginTop: '5px' }}>Remove</button>
        </div>
      ))}
    </div>
  );
}
