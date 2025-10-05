"use client";

import { useState, useEffect } from "react";

export default function TestDebug() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkInsight = async () => {
      try {
        setStatus("loading");
        const res = await fetch("/api/auctions/live");
        const data = await res.json();

        if (res.ok && data.items?.length > 0) {
          setStatus("ok");
          setMessage(`✅ Insight API OK — ${data.items.length} listings loaded`);
        } else {
          setStatus("error");
          setMessage(`🟠 Fallback: Insight API`);
        }
      } catch (e) {
        setStatus("error");
        setMessage(`🔴 Error: ${(e as Error).message}`);
      }
    };

    checkInsight();
  }, []);

  const bg =
    status === "idle"
      ? "bg-neutral-900"
      : status === "loading"
      ? "bg-orange-500"
      : status === "ok"
      ? "bg-green-500"
      : "bg-red-600";

  return (
    <main className={`${bg} min-h-screen flex flex-col items-center justify-center text-white`}>
      <h1 className="text-2xl font-bold mb-4">DAO Sports Marketplace</h1>
      <p>{message}</p>
    </main>
  );
}
