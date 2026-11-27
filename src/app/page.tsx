"use client";

import { useEffect, useState } from "react";
import LoginForm, { INACTIVITY_MINUTES } from "@/modules/login/LoginForm";
import Dashboard from "@/modules/dashboard/Dashboard";
import MasterList from "@/modules/masterlist/MasterList";
import ReviewNewDocuments from "@/modules/review/ReviewNewDocument";

type Page = "dashboard" | "masterlist" | "review";

export default function Home() {
  // undefined = still checking the session, null = signed out.
  const [me, setMe] = useState<{ role: string } | null | undefined>(undefined);
  const [page, setPage] = useState<Page>("dashboard");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => setMe(body?.data ?? null))
      .catch(() => setMe(null));
  }, []);

  // Sign out after INACTIVITY_MINUTES with no input.
  useEffect(() => {
    if (!me) return;

    let timer: ReturnType<typeof setTimeout>;
    const signOut = async () => {
      await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full reload clears in-memory app state after sign-out
      window.location.assign("/?reason=timeout");
    };
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(signOut, INACTIVITY_MINUTES * 60_000);
    };
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [me]);

  // `p` is optional so this is assignable to both `() => void`
  // and `(page: string) => void` prop types.
  const navigate = (p?: string) => {
    if (p === "dashboard" || p === "masterlist" || p === "review") {
      setPage(p);
    }
  };

  if (me === undefined) return null;
  if (!me) return <LoginForm />;

  const role = me.role;

  if (page === "review") {
    return <ReviewNewDocuments role={role} onNavigate={navigate} />;
  }
  if (page === "masterlist") {
    return <MasterList role={role} onNavigate={navigate} />;
  }
  return <Dashboard role={role} onNavigate={navigate} />;
}