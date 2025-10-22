"use client";
import { useState } from "react";

type Props = {
  getHtml: () => string;
  onSaved?: (id: string) => void;
};

export default function SaveButton({ getHtml, onSaved }: Props) {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastId, setLastId] = useState<string | null>(null);

  async function handleSave() {
    try {
      setStatus("saving");
      setError(null);
      setLastId(null);

      const html = getHtml();
      if (typeof html !== "string" || html.trim().length === 0) {
        throw new Error("getHtml() returned an empty string. It must return a full HTML document.");
      }

      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Court Room Output - ${new Date().toISOString()}`,
          html,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Save failed (${res.status}). ${text || ""}`);
      }

      const data: { id: string } = await res.json();
      setLastId(data.id);
      setStatus("done");
      onSaved?.(data.id);
      console.log("[SaveButton] saved snippet", data);
    } catch (e: any) {
      console.error("[SaveButton] error", e);
      setError(e?.message || "Unknown error");
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
          aria-busy={status === "saving"}
        >
          {status === "saving" ? "Saving..." : "Save to DB"}
        </button>

        {status === "done" && lastId && (
          <span className="text-green-700">
            Saved  (id: {lastId})
          </span>
        )}

        {status === "error" && (
          <span className="text-red-700">
            Save failed
          </span>
        )}
      </div>

      {status === "done" && lastId && (
        <a
          className="underline text-blue-700 w-fit"
          href={`/api/render?id=${encodeURIComponent(lastId)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View saved page 
        </a>
      )}

      {error && (
        <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
      )}
    </div>
  );
}

