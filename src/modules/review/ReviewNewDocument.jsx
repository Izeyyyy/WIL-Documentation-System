"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebard";
import TopBar from "../components/TopBar";
import { FileList, DetailPanel } from "../components/ReviewParts";
import { ProvisionalList, ProvisionalDetail } from "../components/ProvisionalParts";
import shell from "@/Assets/css/Dashboard.module.css";
import styles from "@/Assets/css/ReviewNewDocuments.module.css";

/**
 * Review New Documents page.
 *
 * role:  "admin" | "staff"
 * user:  { name, roleLabel }
 * onNavigate: called with a page key from the sidebar
 * data:
 *   counts:  { needs: number, provisional: number }   (numbers on the tabs)
 *   files:   [{ id, name, location, date, status }]    (left list)
 *   detail:  {
 *     name, status, driveUrl,
 *     ocr: { type, language, progress (0-100), message, text },
 *     proposed: [{ field, value }]
 *   }
 *   onSelect(id), onAcceptAll(), onAccept(field), onEdit(field),
 *   onClassifyManually(), onRegister()
 *   provisional: {                                      (Provisional Codes tab)
 *     files:  [{ id, name, location, date, code }], total,
 *     detail: { code, driveUrl, preview: { name, pages },
 *               values: { category, purpose, title, date, description } },
 *     options: { categories: [], purposes: [] },
 *     sync: { lastSync: "today, 3:15 PM" }, onSyncNow(),
 *     onSelect(id), onFilter(), onExtractText(), onExclude(), onConfirm(values)
 *   }
 */
export default function ReviewNewDocuments({
  role = "staff",
  user = {},
  data = {},
  onNavigate = (_page) => {},
}) {
  const { counts = {}, files = [], detail, onSelect, provisional = {}, ...actions } = data;
  const [tab, setTab] = useState("needs");
  const [selectedId, setSelectedId] = useState(files[0]?.id ?? null);
  const [provId, setProvId] = useState(provisional.files?.[0]?.id ?? null);
  const {
    files: provFiles = [],
    total: provTotal,
    detail: provDetail,
    options,
    sync = {},
    onSyncNow,
    onSelect: onProvSelect,
    ...provActions
  } = provisional;

  function selectProv(id) {
    setProvId(id);
    onProvSelect?.(id);
  }

  function select(id) {
    setSelectedId(id);
    onSelect?.(id);
  }

  const tabs = [
    { key: "needs", label: "Needs Classifications", count: counts.needs },
    { key: "provisional", label: "Provisional Codes", count: counts.provisional },
  ];

  return (
    <div className={shell.shell}>
      <Sidebar role={role} active="review" user={user} onNavigate={onNavigate} />

      <div className={shell.main}>
        <TopBar section="Register Documents" page="Review New Documents" user={user} />
        <main className={shell.content}>
          <div className={styles.page}>
            <div className={styles.titleRow}>
              <div>
                <h1 className={styles.title}>Review New Documents</h1>
                <p className={styles.subtitle}>
                  {tab === "needs"
                    ? "Classify files the system could not match. Use OCR to read the scanned files"
                    : "Confirm the codes the system assigned on upload, or classify files it could not match."}
                </p>
              </div>
              {tab === "provisional" && (
                <div className={styles.sync}>
                  <span>Last sync: {sync.lastSync || "—"}</span>
                  <button type="button" className={styles.syncBtn} onClick={() => onSyncNow?.()}>
                    Sync now
                  </button>
                </div>
              )}
            </div>

            <div className={styles.tabs} role="tablist">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.key}
                  className={`${styles.tab} ${tab === t.key ? styles.tabActive : ""}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                  <span className={styles.count}>{t.count ?? 0}</span>
                </button>
              ))}
            </div>

            {tab === "needs" ? (
              <div className={styles.columns}>
                <FileList files={files} selectedId={selectedId} onSelect={select} />
                <DetailPanel detail={files.length ? detail : undefined} {...actions} />
              </div>
            ) : (
              <div className={styles.columnsProv}>
                <ProvisionalList
                  files={provFiles}
                  total={provTotal}
                  selectedId={provId}
                  onSelect={selectProv}
                  onFilter={provActions.onFilter}
                />
                <ProvisionalDetail
                  detail={provFiles.length ? provDetail : undefined}
                  options={options}
                  {...provActions}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}