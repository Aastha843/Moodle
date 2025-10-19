'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

type IssueKey = 'a11y' | 'security' | 'login' | 'database';
type From = 'Boss' | 'Family' | 'Agile' | 'System';
type EventMsg = { at: number; from: From; text: string; issue?: IssueKey };
type ScenarioKey = 'standard' | 'busy';

const SCHEDULES: Record<ScenarioKey, EventMsg[]> = {
  standard: [
    { at: 20,  from: 'Boss',   text: 'Are you done with sprint 1?' },
    { at: 40,  from: 'Family', text: 'Can you pick up the kids after work?' },
    { at: 60,  from: 'Agile',  text: 'Change Title colour to Red' },
    { at: 80,  from: 'System', text: 'Fix alt in img1', issue: 'a11y' },
    { at: 100, from: 'System', text: 'Fix input validation', issue: 'security' },
    { at: 130, from: 'System', text: 'Fix User login', issue: 'login' },
    { at: 160, from: 'System', text: 'Fix Secure Database', issue: 'database' },
  ],
  busy: [
    { at: 15,  from: 'Boss',   text: 'Status on sprint 1?' },
    { at: 35,  from: 'Family', text: 'Dont forget pickup!' },
    { at: 55,  from: 'Agile',  text: 'Change Title colour to Red' },
    { at: 70,  from: 'System', text: 'Fix alt in img1', issue: 'a11y' },
    { at: 90,  from: 'System', text: 'Fix input validation', issue: 'security' },
    { at: 120, from: 'System', text: 'Fix User login', issue: 'login' },
    { at: 150, from: 'System', text: 'Fix Secure Database', issue: 'database' },
  ],
};

const URGENT_DELAY_STAGED = 120; // +2 min (a11y/security)
const COURT_DELAY_STAGED  = 240; // +4 min (a11y/security)
const COURT_DELAY_SIMPLE  = 120; // +2 min (login/database)

const ISSUE_TEXT = {
  a11y: {
    urgent: 'URGENT: fix alt in img1',
    court:  'You ignored accessibility (alt text) — Court for the Disability Discrimination Act.',
  },
  security: {
    urgent: 'URGENT: fix input validation',
    court:  'You were hacked due to missing input validation — Court for Laws of Tort.',
  },
  login: {
    court:  'Users cannot log in — Court: declared bankrupt (no one can use your app; no payment).',
  },
  database: {
    court:  'Database not secured — hacked — Court for Laws of Tort.',
  },
} as const;

type ActiveIssue = {
  key: IssueKey;
  firstSeenAt: number;
  urgentAt?: number;
  courtAt: number;
  urgentSent: boolean;
  courtSent: boolean;
};

function formatSec(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m > 0 && s > 0) return `${m} mins ${s} secs`;
  if (m > 0) return `${m} mins`;
  return `${s} secs`;
}

export default function CourtRoomPage() {
  const studentNumber = '21775745';
  const studentName = 'Aastha Acharya';

  const [scenario, setScenario] = useState<ScenarioKey>('standard');

  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const timerId = useRef<number | null>(null);

  const [messages, setMessages] = useState<string[]>([]);
  const [issues, setIssues] = useState<ActiveIssue[]>([]);
  const [courtAlert, setCourtAlert] = useState<string | null>(null);
  const deliveredRef = useRef<Set<number>>(new Set());

  function start() {
    if (running) return;
    setRunning(true);
    timerId.current = window.setInterval(() => setTime(t => t + 1), 1000);
  }
  function pause() {
    if (!running) return;
    setRunning(false);
    if (timerId.current !== null) window.clearInterval(timerId.current);
    timerId.current = null;
  }
  function reset() {
    pause();
    setTime(0);
    setMessages([]);
    setIssues([]);
    setCourtAlert(null);
    deliveredRef.current.clear();
  }
  function setManual(val: string) {
    const n = Math.max(0, parseInt(val || '0', 10));
    setTime(n);
  }
  function changeScenario(next: ScenarioKey) {
    setScenario(next);
    reset();
  }

  useEffect(() => () => { if (timerId.current) window.clearInterval(timerId.current); }, []);

  
  useEffect(() => {
    const schedule = SCHEDULES[scenario];
    const delivered = deliveredRef.current;

    let nextIssues = issues;       
    let issuesChanged = false;
    const newMsgs: string[] = [];

    const due = schedule.filter(m => m.at <= time && !delivered.has(m.at));
    if (due.length) {
      newMsgs.push(...due.map(m => `${m.from}: ${m.text}`));
      due.forEach(m => delivered.add(m.at));

      for (const d of due) {
        if (!d.issue) continue;
        if (d.issue === 'a11y' || d.issue === 'security') {
          nextIssues = issuesChanged ? nextIssues : [...nextIssues];
          issuesChanged = true;
          nextIssues.push({
            key: d.issue,
            firstSeenAt: d.at,
            urgentAt: d.at + URGENT_DELAY_STAGED,
            courtAt:  d.at + COURT_DELAY_STAGED,
            urgentSent: false,
            courtSent: false,
          });
        } else {
          nextIssues = issuesChanged ? nextIssues : [...nextIssues];
          issuesChanged = true;
          nextIssues.push({
            key: d.issue,
            firstSeenAt: d.at,
            courtAt: d.at + COURT_DELAY_SIMPLE,
            urgentSent: false,
            courtSent: false,
          });
        }
      }
    }


    const overdueUrgent = nextIssues.filter(i => i.urgentAt !== undefined && !i.urgentSent && time >= (i.urgentAt as number));
    if (overdueUrgent.length) {
      newMsgs.push(...overdueUrgent.map(i => ISSUE_TEXT[i.key].urgent!));
     
      const mapped = nextIssues.map(i => (overdueUrgent.includes(i) ? { ...i, urgentSent: true } : i));
    
      if (mapped !== nextIssues) {
        nextIssues = mapped;
        issuesChanged = true;
      }
    }

  
    if (!courtAlert) {
      const overdueCourt = nextIssues.filter(i => !i.courtSent && time >= i.courtAt);
      if (overdueCourt.length) {
        const priority: Record<IssueKey, number> = { a11y: 1, security: 2, login: 3, database: 4 };
        overdueCourt.sort((a, b) => (a.courtAt - b.courtAt) || (priority[a.key] - priority[b.key]));
        const chosen = overdueCourt[0];
        setCourtAlert(ISSUE_TEXT[chosen.key].court);

        const mapped = nextIssues.map(i => (i === chosen ? { ...i, courtSent: true } : i));
        if (mapped !== nextIssues) {
          nextIssues = mapped;
          issuesChanged = true;
        }
      }
    }


    if (newMsgs.length) setMessages(prev => [...prev, ...newMsgs]);
    if (issuesChanged) setIssues(nextIssues);
  }, [time, scenario, courtAlert, issues]);

  const bgUrl = courtAlert ? '/courtroom.png' : '/Desk.png';

  return (
    <div>
      <Header studentNumber={studentNumber} studentName={studentName} />

      <main className="container">
        <section
          aria-label="Court Room"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url('${bgUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            color: '#fff',
            minHeight: 360,
            padding: 16,
            border: '1px solid #ccc',
            borderRadius: 8,
          }}
        >
          <h1 style={{ marginTop: 0 }}>Court Room</h1>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            Scenario:
            <select value={scenario} onChange={e => changeScenario(e.target.value as ScenarioKey)} aria-label="Choose scenario">
              <option value="standard">Standard</option>
              <option value="busy">Busy</option>
            </select>
          </label>

          <p>
            Messages every ~20–30 seconds. If you ignore <b>“fix alt in img1”</b> or <b>“fix input validation”</b>,
            it becomes <b>URGENT</b> at <b>+120s</b> and <b>COURT</b> at <b>+240s</b> (from when it appeared).
            Ignoring <b>Fix User login</b> or <b>Fix Secure Database</b> leads to <b>COURT</b> at <b>+120s</b>.
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={start} aria-label="Start timer">
              <img src="/Play%20Button.svg" alt="" aria-hidden width={22} height={22} />
            </button>
            <button onClick={pause} aria-label="Pause timer">
              <img src="/Pause%20Button.svg" alt="" aria-hidden width={22} height={22} />
            </button>
            <button onClick={reset} aria-label="Reset timer">
              <img src="/Restart.svg" alt="" aria-hidden width={22} height={22} />
            </button>

            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Set time (s):
              <input
                type="number"
                min={0}
                onChange={e => setManual(e.target.value)}
                placeholder="0"
                aria-label="Set time in seconds"
                style={{ width: 110, padding: 4, borderRadius: 4, border: '1px solid #bbb' }}
              />
            </label>
          </div>

          <p style={{ marginTop: 8 }}>
            <strong>Time:</strong> {formatSec(time)} ({time}s)
          </p>

          {courtAlert && (
            <div role="alert" style={{ border: '2px solid red', padding: 8, marginTop: 8, background: '#ffecec', color: '#000', borderRadius: 6 }}>
              {courtAlert}
            </div>
          )}

          <h2 style={{ marginTop: 16 }}>Incoming messages</h2>
          <ul aria-label="Incoming messages" style={{ paddingLeft: 18 }}>
            {messages.map((m, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{m}</li>
            ))}
          </ul>
        </section>
      </main>

      <Footer studentName={studentName} studentNumber={studentNumber} />
    </div>
  );
}
