'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

type Tab = { id: number; heading: string; content: string };
const MAX_TABS = 15;

export default function HomePage() {
  const studentNumber = '21775745';
  const studentName = 'Aastha Acharya';

  // Tabs state (persist to localStorage)
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('tabs') : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Tab[];
        setTabs(parsed.length ? parsed : [{ id: Date.now(), heading: 'Tab 1', content: 'Content 1' }]);
      } catch {
        setTabs([{ id: Date.now(), heading: 'Tab 1', content: 'Content 1' }]);
      }
    } else {
      setTabs([{ id: Date.now(), heading: 'Tab 1', content: 'Content 1' }]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }, [tabs, loaded]);

  function addTab() {
    if (tabs.length >= MAX_TABS) return;
    const n = tabs.length + 1;
    setTabs(prev => [...prev, { id: Date.now(), heading: `Tab ${n}`, content: `Content ${n}` }]);
  }
  function removeTab(id: number) {
    setTabs(prev => prev.filter(t => t.id !== id));
  }
  function updateTab(id: number, key: 'heading' | 'content', value: string) {
    setTabs(prev => prev.map(t => (t.id === id ? { ...t, [key]: value } : t)));
  }
  function resetAll() {
    setTabs([{ id: Date.now(), heading: 'Tab 1', content: 'Content 1' }]);
  }

  // Output: inline-only CSS + plain JS (no classes)
  const outputHtml = useMemo(() => {
    const css =
      'body{font-family:Arial,sans-serif;margin:24px}' +
      'button{padding:8px;border:1px solid #333;background:#eee;margin-right:8px;cursor:pointer}' +
      "button[aria-selected='true']{background:#333;color:#fff}" +
      'section[role=tabpanel]{margin-top:16px;border:1px solid #ccc;padding:12px}';
    const js =
      "var tabs=document.querySelectorAll('[role=tab]');" +
      "var panels=document.querySelectorAll('[role=tabpanel]');" +
      "tabs.forEach(function(tab){" +
      "  tab.addEventListener('click',function(){" +
      "    tabs.forEach(function(t){t.setAttribute('aria-selected','false');});" +
      "    panels.forEach(function(p){p.hidden=true;});" +
      "    var id=tab.getAttribute('aria-controls');" +
      "    document.getElementById(id).hidden=false;" +
      "    tab.setAttribute('aria-selected','true');" +
      "  });" +
      "});";

    const buttons = tabs
      .map(
        (t, i) =>
          `<button role="tab" aria-selected="${i === 0}" aria-controls="panel-${i}" id="tab-${i}">${escapeHtml(
            t.heading || `Tab ${i + 1}`
          )}</button>`
      )
      .join('');
    const panels = tabs
      .map(
        (t, i) =>
          `<section role="tabpanel" id="panel-${i}" aria-labelledby="tab-${i}" ${
            i !== 0 ? 'hidden' : ''
          }><h2 style="margin:0 0 8px 0">${escapeHtml(t.heading || `Tab ${i + 1}`)}</h2><p>${escapeHtml(
            t.content || ''
          )}</p></section>`
      )
      .join('');

    return (
      '<!doctype html><html lang="en"><head>' +
      '<meta charset="utf-8"/><title>Tabs Output</title>' +
      '<meta name="viewport" content="width=device-width,initial-scale=1"/>' +
      `<style>${css}</style></head><body>` +
      `<h1 style="margin-top:0">Tabs Output</h1>` +
      `<div role="tablist" aria-label="Tabs">${buttons}</div>` +
      panels +
      `<script>${js}<\\/script>` +
      '</body></html>'
    );
  }, [tabs]);

  function copyOutput() {
    navigator.clipboard.writeText(outputHtml);
    alert('Output HTML copied to clipboard!');
  }
  function downloadOutput() {
    const blob = new Blob([outputHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Hello.html';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!loaded) return null;

  return (
    <div>
      <Header studentNumber={studentNumber} studentName={studentName} />
      <main className="container">
        <h1 style={{ marginTop: 0 }}>Tabs Builder (Home)</h1>
        <p style={{ marginTop: 0 }}>
          Add (+) / remove (−) tabs, edit headings and content. Tabs persist in <b>localStorage</b>. Generate output
          HTML with <b>inline CSS only</b> (no classes). Use in your video to show 1, 3 and 5 tabs.
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button onClick={addTab} disabled={tabs.length >= MAX_TABS} className="btn">
            + Add Tab ({tabs.length}/{MAX_TABS})
          </button>
          <button onClick={resetAll} className="btn">Reset to 1 Tab</button>
          <button onClick={copyOutput} className="btn">Copy Output HTML</button>
          <button onClick={downloadOutput} className="btn">Download Hello.html</button>
        </div>

        {tabs.map((tab, idx) => (
          <div
            key={tab.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              background: 'rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <label style={{ minWidth: 90 }}>Heading {idx + 1}</label>
              <input
                value={tab.heading}
                onChange={(e) => updateTab(tab.id, 'heading', e.target.value)}
                style={{ flex: 1, padding: 8, border: '1px solid #bbb', borderRadius: 6 }}
                aria-label={`Heading for tab ${idx + 1}`}
              />
              <button onClick={() => removeTab(tab.id)} className="btn" aria-label={`Remove tab ${idx + 1}`}>
                − Remove
              </button>
            </div>

            <label style={{ display: 'block', marginBottom: 6 }}>Content {idx + 1}</label>
            <textarea
              value={tab.content}
              onChange={(e) => updateTab(tab.id, 'content', e.target.value)}
              style={{ width: '100%', height: 80, padding: 8, border: '1px solid #bbb', borderRadius: 6 }}
              aria-label={`Content for tab ${idx + 1}`}
            />
          </div>
        ))}

        <h2 style={{ marginTop: 20 }}>Preview of Output (read-only)</h2>
        <textarea
          readOnly
          value={outputHtml}
          style={{ width: '100%', height: 280, padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
          aria-label="Generated HTML output"
        />
      </main>
      <Footer studentName={studentName} studentNumber={studentNumber} />
    </div>
  );
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
