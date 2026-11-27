"use client";

import { useEffect, useState } from "react";
import LoginForm, { INACTIVITY_MINUTES } from "@/modules/login/LoginForm";
import Dashboard from "@/modules/dashboard/Dashboard";
import MasterList from "@/modules/masterlist/MasterList";
import ReviewNewDocuments from "@/modules/review/ReviewNewDocument";
import IncompleteRecords from "@/modules/incomplete/IncompleteRecords";

type Page = "dashboard" | "masterlist" | "review" | "incomplete";

const PAGES: Page[] = ["dashboard", "masterlist", "review", "incomplete"];

// DEV ONLY: skip the login and go straight to the app.
// Set to false (or delete these two lines) before you push.
const SKIP_LOGIN = process.env.NODE_ENV === "development" && true;
const DEV_ROLE = "admin"; // or "staff"

export default function Home() {
  // undefined = still checking the session, null = signed out.
  const [me, setMe] = useState<{ role: string } | null | undefined>(undefined);
  const [page, setPage] = useState<Page>("dashboard");

  useEffect(() => {
    if (SKIP_LOGIN) {
      setMe({ role: DEV_ROLE });
      return;
    }
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => setMe(body?.data ?? null))
      .catch(() => setMe(null));
  }, []);

  // Sign out after INACTIVITY_MINUTES with no input.
  useEffect(() => {
    if (!me || SKIP_LOGIN) return;

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

  const navigate = (p?: string) => {
    if (p === undefined) return;
    if ((PAGES as string[]).includes(p)) setPage(p as Page);
  };

  if (me === undefined) return null;
  if (!me) return <LoginForm />;

  const role = me.role;

  if (page === "review") {
    return <ReviewNewDocuments role={role} onNavigate={navigate} />;
  }
  if (page === "incomplete") {
    return <IncompleteRecords role={role} onNavigate={navigate} />;
  }
  if (page === "masterlist") {
    return <MasterList role={role} onNavigate={navigate} />;
  }
  return <Dashboard role={role} onNavigate={navigate} />;
}