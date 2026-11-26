"use client";

import { useState } from "react";
import styles from "../../../Assets/css/MasterListViews.module.css";

/* ---------------- Staff: table of coded documents ---------------- */

const STAFF_COLUMNS = ["Code", "Title", "Category", "Purpose", "Document Date", "Code status"];

/**
 * rows: [{ id, code, title, category, purpose, date, status: "Provisional" | "Confirmed" }]
 * total: number of documents overall (for "Showing 1-8 of 512")
 * page / pageSize: current page info
 */
export function StaffTable({ rows = [], total = 0, page = 1, pageSize = 8, onPrevious, onNext }) {
  const start = rows.length ? (page - 1) * pageSize + 1 : 0;
  const end = rows.length ? start + rows.length - 1 : 0;

  return (
    <section aria-label="Documents">
      <div className={styles.card}>
        <div className={`${styles.staffGrid} ${styles.staffHead}`} role="row">
          {STAFF_COLUMNS.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>

        {rows.length === 0 ? (
          <p className={styles.empty}>No documents yet</p>
        ) : (
          rows.map((r) => (
            <div key={r.id ?? r.code} className={`${styles.staffGrid} ${styles.staffRow}`} role="row">
              <span className={styles.code}>{r.code}</span>
              <span>{r.title}</span>
              <span>{r.category}</span>
              <span>{r.purpose}</span>
              <span>{r.date}</span>
              <span>
                <span
                  className={`${styles.pill} ${r.status === "Confirmed" ? styles.pillOk : styles.pillWarn}`}
                >
                  {r.status}
                </span>
              </span>
            </div>
          ))
        )}
      </div>

      <div className={styles.footer}>
        <p className={styles.showing}>
          {rows.length ? `Showing ${start} -${end} of ${total}` : "Showing 0 of 0"}
        </p>
        <div className={styles.pager}>
          <button type="button" className={styles.pagerBtn} onClick={onPrevious} disabled={page <= 1}>
            Previous
          </button>
          <button type="button" className={styles.pagerBtn} onClick={onNext} disabled={end >= total}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Admin: file-explorer style list ---------------- */

/**
 * path: ["All documents", "Finance", "Reports"]  (last item is the current folder)
 * rows: [{ id, type: "PDF" | "XLS" | "DOC", name, meta, modified, size }]
 * total: number of documents in this folder
 */
export function AdminExplorer({
  path = ["All documents"],
  rows = [],
  total = 0,
  onShare,
  onEdit,
  onDelete,
}) {
  const [selected, setSelected] = useState([]);
  const current = path[path.length - 1];

  function toggle(id) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  return (
    <section className={`${styles.card} ${styles.explorer}`} aria-label="Document explorer">
      <nav className={styles.crumbs} aria-label="Folder path">
        {path.map((p, i) => (
          <span key={p + i} className={i === path.length - 1 ? styles.crumbCurrent : undefined}>
            {p}
            {i < path.length - 1 && <span className={styles.crumbSlash}>/</span>}
          </span>
        ))}
      </nav>

      <div className={styles.folderHead}>
        <div>
          <h2 className={styles.folderTitle}>{current}</h2>
          <p className={styles.folderCount}>{total} documents</p>
        </div>
        <button type="button" className={styles.shareBtn} onClick={() => onShare?.()}>
          Share
        </button>
      </div>

      {selected.length > 0 && (
        <div className={styles.selectionBar}>
          <strong>{selected.length} selected</strong>
          <div className={styles.selectionActions}>
            <button type="button" onClick={() => onEdit?.(selected)}>Edit</button>
            <button type="button" onClick={() => onShare?.(selected)}>Share</button>
            <button type="button" onClick={() => onDelete?.(selected)}>Delete</button>
            <button type="button" aria-label="Clear selection" onClick={() => setSelected([])}>×</button>
          </div>
        </div>
      )}

      <div className={`${styles.fileGrid} ${styles.fileHead}`} role="row">
        <span className={styles.nameHead}>
          <span className={styles.box} aria-hidden="true" />
          Name
        </span>
        <span>Modified ↓</span>
        <span>Size</span>
      </div>

      {rows.length === 0 ? (
        <p className={styles.empty}>No documents yet</p>
      ) : (
        rows.map((r) => {
          const on = selected.includes(r.id);
          return (
            <div
              key={r.id}
              className={`${styles.fileGrid} ${styles.fileRow} ${on ? styles.fileRowOn : ""}`}
              role="row"
            >
              <span className={styles.nameCell}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(r.id)}
                  aria-label={`Select ${r.name}`}
                />
                <span className={`${styles.badge} ${styles["badge" + r.type] || ""}`}>{r.type}</span>
                <span>
                  <span className={styles.fileName}>{r.name}</span>
                  <span className={styles.fileMeta}>{r.meta}</span>
                </span>
              </span>
              <span>{r.modified}</span>
              <span>{r.size}</span>
            </div>
          );
        })
      )}

      <div className={styles.explorerFooter}>
        <span>{rows.length ? `Showing 1–${rows.length} of ${total}` : "Showing 0 of 0"}</span>
        <span className={styles.pages}>‹ <b>1</b> ›</span>
      </div>
    </section>
  );
}
