import styles from "@/Assets/css/ReviewParts.module.css";

const FIELDS = ["Category", "Purpose", "Title", "Document date"];

function FileIcon() {
  return (
    <svg className={styles.fileIcon} width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Pencil() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function External() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 9h8M8 12h8M8 15h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Left box: files waiting for classification ---------------- */

/** files: [{ id, name, location, date, status }]  status defaults to "No code yet" */
export function FileList({ files = [], selectedId, onSelect }) {
  return (
    <section className={styles.box} aria-label="Files to classify">
      <h2 className={styles.boxTitle}>
        {files.length} {files.length === 1 ? "File needs" : "Files need"} classifications
      </h2>

      {files.length === 0 ? (
        <p className={styles.empty}>No files to review</p>
      ) : (
        <ul className={styles.fileList}>
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
                  <span className={styles.noCode}>{f.status || "No code yet"}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ---------------- Right box: OCR result and proposed values ---------------- */

/**
 * detail: { name, status, driveUrl,
 *           ocr: { type, language, progress, message, text },
 *           proposed: [{ field, value }] }
 * Leave `detail` out for the empty state.
 */
export function DetailPanel({ detail, onAcceptAll, onAccept, onEdit, onClassifyManually, onRegister }) {
  const has = Boolean(detail);
  const ocr = detail?.ocr || {};
  const rows = FIELDS.map((field) => ({
    field,
    value: detail?.proposed?.find((p) => p.field === field)?.value,
  }));

  return (
    <section className={styles.box} aria-label="Document details">
      <div className={styles.detailHead}>
        <div className={styles.detailTitleRow}>
          <h2 className={styles.detailTitle}>{has ? detail.name : "No file selected"}</h2>
          {has && <span className={styles.statusPill}>{detail.status || "Needs classification"}</span>}
        </div>
        {has && (
          <a className={styles.driveLink} href={detail.driveUrl || "#"} target="_blank" rel="noreferrer">
            <External /> Open in Drive
          </a>
        )}
      </div>

      <div className={styles.ocr}>
        <div className={styles.ocrHead}>
          <span className={styles.ocrTitle}>
            <ScanIcon /> Extract text (OCR)
          </span>
          {has && ocr.type && (
            <span className={styles.badge}>
              {ocr.type}
              {ocr.language ? ` · ${ocr.language}` : ""}
            </span>
          )}
        </div>

        <div className={styles.progress}>
          <span className={styles.bar}>
            <span className={styles.barFill} style={{ width: `${has ? ocr.progress ?? 0 : 0}%` }} />
          </span>
          <span className={styles.progressText}>{has ? ocr.message : "Waiting for a file"}</span>
        </div>

        <div className={styles.extracted}>
          <p className={styles.extractedLabel}>Extracted text</p>
          <pre className={styles.extractedText}>{has && ocr.text ? ocr.text : "—"}</pre>
        </div>

        <div className={styles.proposedHead}>
          <h3>Proposed values</h3>
          <button type="button" className={styles.linkBtn} disabled={!has} onClick={() => onAcceptAll?.()}>
            Accept all
          </button>
        </div>

        <div className={styles.table}>
          <div className={`${styles.tRow} ${styles.tHead}`}>
            <span>Field</span>
            <span>Proposed value</span>
            <span />
          </div>
          {rows.map((r) => (
            <div key={r.field} className={styles.tRow}>
              <span>{r.field}</span>
              <span>{r.value || "—"}</span>
              <span className={styles.rowActions}>
                <button type="button" className={styles.acceptBtn} disabled={!has} onClick={() => onAccept?.(r.field)}>
                  <Check /> Accept
                </button>
                <button type="button" className={styles.editBtn} disabled={!has} onClick={() => onEdit?.(r.field)}>
                  <Pencil /> Edit
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className={styles.notice}>
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="1" fill="currentColor" />
        </svg>
        Accepted values fill in the classification form. A code is issued only when you register the document.
      </p>

      <div className={styles.footerBtns}>
        <button type="button" className={styles.manualBtn} disabled={!has} onClick={() => onClassifyManually?.()}>
          <Pencil /> Classify manually
        </button>
        <button type="button" className={styles.registerBtn} disabled={!has} onClick={() => onRegister?.()}>
          <Check /> Register document
        </button>
      </div>
    </section>
  );
}
