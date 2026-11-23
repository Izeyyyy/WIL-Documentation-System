"use client";

import { useEffect, useState } from "react";
import styles from "./loginForm.module.css";

// Point this at your backend's Google OAuth start route, or pass an
// `onGoogleSignIn` prop (e.g. () => signIn("google") from next-auth).
const GOOGLE_AUTH_URL = "/api/auth/google";
const INACTIVITY_MINUTES = 20;

// Redirect to /?error=not_registered when sign-in is refused, and to
// /?reason=timeout after an inactivity sign-out.
const ERRORS = {
  not_registered: {
    title: "Your account is not registered.",
    body: "Contact your Administrator to register your account.",
  },
  default: {
    title: "We couldn't sign you in.",
    body: "Please try again or contact your Administrator.",
  },
};

const NOTICES = {
  timeout: {
    title: `You were signed out after ${INACTIVITY_MINUTES} minutes of inactivity.`,
    body: "Sign in again to continue",
  },
};

function GoogleIcon() {
  return (
    <svg className={styles.googleIcon} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className={styles.bannerIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.5 2.5 20h19L12 3.5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 10v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className={styles.bannerIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

export default function LoginForm({ onGoogleSignIn }) {
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log("styles:", styles)

  // Read ?error= / ?reason= once on load, then tidy the address bar.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get("error");
    const reasonCode = params.get("reason");

    if (errorCode) setError(ERRORS[errorCode] || ERRORS.default);
    if (reasonCode && NOTICES[reasonCode]) setNotice(NOTICES[reasonCode]);

    if (errorCode || reasonCode) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Re-enable the button if the user returns with the browser's Back button.
  useEffect(() => {
    const onPageShow = (event) => {
      if (event.persisted) setLoading(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  async function handleSignIn() {
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      if (onGoogleSignIn) {
        await onGoogleSignIn();
      } else {
        window.location.assign(GOOGLE_AUTH_URL);
        return; // leaving the page, keep the button disabled
      }
    } catch {
      setError(ERRORS.default);
    }
    setLoading(false);
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="welcome-title">
        <h1 id="welcome-title" className={styles.title}>
          Welcome
        </h1>
        <p className={styles.subtitle}>
          Sign in with your Google account to access WIL documents.
        </p>

        <button
          type="button"
          className={styles.googleBtn}
          onClick={handleSignIn}
          disabled={loading}
          aria-busy={loading}
        >
          <GoogleIcon />
          <span>Sign in using Google</span>
        </button>

        <p className={styles.hint}>Use your registered Google account</p>
        <hr className={styles.divider} />

        {/* Shown when sign-in is refused */}
        {error && (
          <div className={`${styles.banner} ${styles.bannerError}`} role="alert">
            <WarningIcon />
            <div className={styles.bannerText}>
              <strong className={styles.errorTitle}>{error.title}</strong>
              <span>{error.body}</span>
            </div>
          </div>
        )}

        {/* Shown after the session expires */}
        {notice && (
          <div className={`${styles.banner} ${styles.bannerNotice}`} role="status">
            <InfoIcon />
            <div className={styles.bannerText}>
              <strong>{notice.title}</strong>
              <strong>{notice.body}</strong>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}