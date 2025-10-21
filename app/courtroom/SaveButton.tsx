// app/court-room/SaveButton.tsx
"use client";

import { useCallback, useState } from "react";


type Props = {
  getHtml?: () => string;
  titlePrefix?: string; // optional custom title prefix
};

export default function SaveButton({ getHtml, titlePrefix = "Court Room Output" }: Props) {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [lastId, setLastId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const buildHtml = useCallback((): string => {
    try {
      if (typeof getHtml === "function") {
        const html = getHtml();
        if (typeof html === "string" && html.trim().length > 0) return html;
      }
    } catch {
      /* ignore and fallback */
    }

    return document.documentElement.outerHTML;
  }, [getHtml]);

  async function handleSave() {
    try {
      setStatus("saving");
      setMessage("");
      setLastId(null);

      const html = buildHtml();
      if (!html || !html.trim()) {
        setStatus("error");
        setMessage("No HTML to save.");
        return;
      }

      const title = `${titlePrefix} - ${new Date().toISOString()}`;

      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, html }),
      });

      if (!res.ok) {
        const problem = await safeJson(res);
        throw new Error(problem?.error || `Save failed with status ${res.status}`);
      }

      const created = await res.json();
      setLastId(created?.id ?? null);
      setStatus("done");
      setMessage("Saved successfully.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Unknown error while saving.");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSave}
        disabled={status === "saving"}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
        aria-busy={status === "saving"}
        aria-live="polite"
      >
        {status === "saving" ? "Saving..." : "Save to DB"}
      </button>

      {status === "done" && lastId && (
        <span className="text-green-700">
          Saved ✓ (id: <code>{lastId}</code>)
        </span>
      )}

      {status === "error" && (
        <span className="text-red-700">
          Save failed. {message ? <>{message}</> : "Try again."}
        </span>
      )}
    </div>
  );
}


async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
