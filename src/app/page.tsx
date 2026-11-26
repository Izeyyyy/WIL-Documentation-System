"use client";

import { useState } from "react";
import LoginForm from "@/modules/login/LoginForm";
import Dashboard from "@/modules/dashboard/Dashboard";
import MasterList from "@/modules/masterlist/MasterList";

type Page = "dashboard" | "masterlist";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState<Page>("dashboard");
  const role = "staff"; // or "admin"

  if (!isLoggedIn) {
    // Temporary: skips real Google OAuth. Replace with your real sign-in later.
    return <LoginForm onGoogleSignIn={() => setIsLoggedIn(true)} />;
  }

  return page === "masterlist" ? (
    <MasterList role={role} onNavigate={(p: Page) => setPage(p)} />
  ) : (
    <Dashboard role={role} onNavigate={(p: Page) => setPage(p)} />
  );
}