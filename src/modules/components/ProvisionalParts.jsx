"use client";

import { useState } from "react";
import styles from "@/Assets/css/ProvisionalParts.module.css";

function FileIcon() {
  return (
    <svg className={styles.fileIcon} width="17" height="19" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h16l-6 8v6l-4-2v-4L4 5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 9h8M8 12h8M8 15h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg className={styles.selectChev} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- Left card: files with provisional codes ---------------- */

/** files: [{ id, name, location, date, code }] */
export function ProvisionalList({ files = [], total, selectedId, onSelect, onFilter }) {
  const count = total ?? files.length;
  const more = count - files.length;

  return (
    <section className={styles.card} aria-label="Files to confirm">
      <div className={styles.listHead}>
        <h2 className={styles.listTitle}>
          {count} {count === 1 ? "file" : "files"} to confirm
        </h2>
        <button type="button" className={styles.filterBtn} onClick={() => onFilter?.()}>
          <FilterIcon /> Filter
        </button>
      </div>

      {files.length === 0 ? (
        <p className={styles.empty}>No files to confirm</p>
      ) : (
        <ul className={styles.list}>
          {files.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                className={`${styles.file} ${f.id === selectedId ? styles.fileActive : ""}`}
                onClick={() => onSelect?.(f.id)}
                aria-current={f.id === selectedId ? "true" : undefined}
              >
                <FileIcon />
                <span className={styles.fileText}>
                  <span className={styles.fileName}>{f.name}</span>
                  <span className={styles.fileMeta}>
                    {f.location} · {f.date}
                  </span>
                  <span className={styles.codePill}>{f.code}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {more > 0 && <p className={styles.more}>+ {more} more</p>}
    </section>
  );
}

/* ---------------- Right card: review one provisional code ---------------- */

function Select({ label, name, value, options = [], disabled }) {
  const list = value && !options.includes(value) ? [value, ...options] : options;
  return (
    <label className={styles.field}>
      <span className={styles.label}>
        {label} <b className={styles.req}>*</b>
      </span>
      <span className={styles.selectWrap}>
        <select name={name} defaultValue={value ?? ""} disabled={disabled}>
          {!value && <option value="" disabled>—</option>}
          {list.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <Chevron />
      </span>
    </label>
  );
}

/**
 * detail: { code, driveUrl, preview: { name, pages },
 *           values: { category, purpose, title, date, description } }
 * options: { categories: [...], purposes: [...] }
 * Leave `detail` out for the empty state.
 */
export function ProvisionalDetail({ detail, options = {}, onExtractText, onExclude, onConfirm }) {
  const has = Boolean(detail);
  const v = detail?.values || {};
  const [touched, setTouched] = useState(false);
  const missingDescription = has && !v.description && !touched;

  function submit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onConfirm?.(Object.fromEntries(form.entries()));
  }

  return (
    <section className={styles.card} aria-label="Document details">
      <form key={detail?.code || "empty"} onSubmit={submit} className={styles.form}>
        <div className={styles.detailHead}>
          <div className={styles.detailTitleRow}>
            <h2 className={styles.detailTitle}>{has ? detail.code : "No file selected"}</h2>
            {has && <span className={styles.statusPill}>Provisional code</span>}
          </div>
          {has && (
            <a className={styles.driveLink} href={detail.driveUrl || "#"} target="_blank" rel="noreferrer">
              <ExternalIcon /> Open in Drive
            </a>
          )}
        </div>

        <div className={styles.preview}>
          <span className={styles.sheet} aria-hidden="true">
            <i /><i /><i /><i /><i />
          </span>
          <p className={styles.previewText}>
            {has ? (
              <>
                Google Drive preview
                <br />
                <b>{detail.preview?.name}</b>
                {detail.preview?.pages ? ` · ${detail.preview.pages} pages` : ""}
              </>
            ) : (
              "No preview available"
            )}
          </p>
        </div>

        <div className={styles.grid}>
          <Select label="Category" name="category" value={v.category} options={options.categories} disabled={!has} />
          <Select label="Purpose" name="purpose" value={v.purpose} options={options.purposes} disabled={!has} />

          <label className={styles.field}>
            <span className={styles.label}>Title <b className={styles.req}>*</b></span>
            <input name="title" type="text" defaultValue={v.title ?? ""} disabled={!has} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Document date <b className={styles.req}>*</b></span>
            <input name="date" type="text" defaultValue={v.date ?? ""} disabled={!has} />
          </label>

          <label className={`${styles.field} ${styles.wide}`}>
            <span className={styles.label}>Description</span>
            <input
              name="description"
              type="text"
              placeholder="Add a short description of the document"
              defaultValue={v.description ?? ""}
              disabled={!has}
              className={missingDescription ? styles.invalid : undefined}
              onChange={() => setTouched(true)}
            />
            {missingDescription && (
              <span className={styles.errorText}>
                Missing — the record will be listed in Incomplete Records until this is filled in.
              </span>
            )}
          </label>
        </div>

        <p className={styles.notice}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="16.5" r="1" fill="currentColor" />
          </svg>
          <span>
            Changing the <b>category</b> or <b>purpose</b> retires {has ? detail.code : "the code"} and issues a new
            code. Retired codes are never reused. Confirmed codes never change.
          </span>
        </p>

        <div className={styles.actions}>
          <button type="button" className={styles.ocrBtn} disabled={!has} onClick={() => onExtractText?.()}>
            <ScanIcon /> Extract text (OCR)
          </button>
          <div className={styles.actionsRight}>
            <button type="button" className={styles.excludeBtn} disabled={!has} onClick={() => onExclude?.()}>
              Exclude file
            </button>
            <button type="submit" className={styles.confirmBtn} disabled={!has}>
              <CheckIcon /> Confirm code
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
