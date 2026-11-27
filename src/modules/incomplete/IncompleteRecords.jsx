"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebard";
import TopBar from "../components/TopBar";
import { Filters, RecordsTable, AllCompleteBanner, WarningIcon } from "../components/IncompleteParts";
import shell from "../../Assets/css/Dashboard.module.css";
import styles from "@/Assets/css/IncompleteParts.module.css";

export default function IncompleteRecords({
  role = "staff",
  user = {},
  data = {},
  onNavigate = () => {},
}) {
  const { total = 0, rows = [], page = 1, pageSize = 8, options = {}, onFilterChange, onFix, onPrevious, onNext } = data;
  const [filters, setFilters] = useState({ category: "", missing: "", status: "", search: "" });

  function change(name, value) {
    const next = { ...filters, [name]: value };
    setFilters(next);
    onFilterChange?.(next);
  }

  return (
    <div className={shell.shell}>
      <Sidebar role={role} active="incomplete" user={user} onNavigate={onNavigate} />

      <div className={shell.main}>
        <TopBar section="Register Documents" page="Incomplete Records" user={user} />
        <main className={shell.content}>
          <div className={styles.page}>
            <div className={styles.titleRow}>
              <div>
                <h1 className={styles.title}>Incomplete Records</h1>
                <p className={styles.subtitle}>
                  Registered documents with missing details. Fix them so they show up correctly in search and reports.
                </p>
              </div>
              <span className={styles.badge}>
                <WarningIcon /> {total} incomplete records
              </span>
            </div>

            <Filters values={filters} options={options} onChange={change} />

            {rows.length === 0 ? (
              <AllCompleteBanner />
            ) : (
              <RecordsTable
                rows={rows}
                total={total}
                page={page}
                pageSize={pageSize}
                onFix={onFix}
                onPrevious={onPrevious}
                onNext={onNext}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}