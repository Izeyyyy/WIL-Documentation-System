"use client";

import { useState } from "react";
import styles from "@/Assets/css/MasterList.module.css";

export function Chevron() {
  return (
    <svg className={styles.chev} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h2M10 6h10M4 12h2M10 12h10M4 18h2M10 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="4" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="13" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="13" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function PageHeader({
  title = "Master List",
  subtitle = "Every registered WIL documents. Search by code, title, or keyword, then open it in Google Drive.",
}) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}

/**
 * Search box, three filter dropdowns and the List / Grid switch.
 * Props are all optional: onSearch(text), onFilter(name, value), onViewChange(view)
 */
export function Toolbar({ onSearch, onFilter, onViewChange }) {
  const [view, setView] = useState("list");

  const filters = [
    { key: "fileType", label: "File type" },
    { key: "owner", label: "Owner" },
    { key: "modified", label: "Modified" },
  ];

  function changeView(next) {
    setView(next);
    onViewChange?.(next);
  }

  return (
    <div className={styles.toolbar}>
      <label className={styles.search}>
        <SearchIcon />
        <input
          type="search"
          placeholder="Search files and folders"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </label>

      {filters.map((f) => (
        <button
          key={f.key}
          type="button"
          className={styles.filter}
          onClick={() => onFilter?.(f.key)}
        >
          {f.label}
          <Chevron />
        </button>
      ))}

      <div className={styles.views}>
        <button
          type="button"
          className={`${styles.viewBtn} ${view === "list" ? styles.viewActive : ""}`}
          aria-pressed={view === "list"}
          onClick={() => changeView("list")}
        >
          <ListIcon /> List
        </button>
        <button
          type="button"
          className={`${styles.viewBtn} ${view === "grid" ? styles.viewActive : ""}`}
          aria-pressed={view === "grid"}
          onClick={() => changeView("grid")}
        >
          <GridIcon /> Grid
        </button>
      </div>
    </div>
  );
}
