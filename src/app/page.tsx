"use client";

import { useState } from "react";
import LoginForm from "@/modules/login/LoginForm";
import Dashboard from "@/modules/dashboard/Dashboard";
import MasterList from "@/modules/masterlist/MasterList";
import ReviewNewDocuments from "@/modules/review/ReviewNewDocument";

type Page = "dashboard" | "masterlist" | "review";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState<Page>("dashboard");
  const role = "staff"; // or "admin"

  // `p` is optional so this is assignable to both `() => void`
  // and `(page: string) => void` prop types.
  const navigate = (p?: string) => {
    if (p === "dashboard" || p === "masterlist" || p === "review") {
      setPage(p);
    }
  };

  if (!isLoggedIn) {
    // Temporary: skips real Google OAuth. Replace with your real sign-in later.
    return <LoginForm onGoogleSignIn={() => setIsLoggedIn(true)} />;
  }

  if (page === "review") {
    return <ReviewNewDocuments role={role} onNavigate={navigate} />;
  }
  if (page === "masterlist") {
    return <MasterList role={role} onNavigate={navigate} />;
  }
  return <Dashboard role={role} onNavigate={navigate} />;
}