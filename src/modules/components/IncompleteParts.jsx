import styles from "@/Assets/css/IncompleteParts.module.css";

export function WarningIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5 2.5 20h19L12 3.5z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M12 10v5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="12" cy="17.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg className={styles.chev} width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className={styles.chev} width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- Filters ---------------- */

const DEFAULT_MISSING = ["Title", "Document date", "Description"];
const DEFAULT_STATUS = ["Provisional", "Confirmed"];

function SelectFilter({ label, name, allLabel, choices = [], value, onChange }) {
  return (
    <label className={styles.filter}>
      <span className={styles.filterLabel}>{label}</span>
      <span className={styles.control}>
        <select value={value} onChange={(e) => onChange?.(name, e.target.value)}>
          <option value="">{allLabel}</option>
          {choices.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <Chevron />
      </span>
    </label>
  );
}

/** options: { categories, missingFields, codeStatuses } */
export function Filters({ values, options = {}, onChange }) {
  return (
    <div className={styles.filters}>
      <SelectFilter label="Category" name="category" allLabel="All categories" choices={options.categories}
        value={values.category} onChange={onChange} />
      <SelectFilter label="Missing field" name="missing" allLabel="Any field"
        choices={options.missingFields || DEFAULT_MISSING} value={values.missing} onChange={onChange} />
      <SelectFilter label="Code status" name="status" allLabel="All"
        choices={options.codeStatuses || DEFAULT_STATUS} value={values.status} onChange={onChange} />

      <label className={styles.filter}>
        <span className={styles.filterLabel}>Search</span>
        <span className={styles.control}>
          <input
            type="search"
            placeholder="Code or title"
            value={values.search}
            onChange={(e) => onChange?.("search", e.target.value)}
          />
          <SearchIcon />
        </span>
      </label>
    </div>
  );
}

/* ---------------- Table ---------------- */

export function RecordsTable({ rows = [], total = 0, page = 1, pageSize = 8, onFix, onPrevious, onNext }) {
  const start = (page - 1) * pageSize + 1;
  const end = start + rows.length - 1;

  return (
    <section aria-label="Incomplete records">
      <div className={styles.card}>
        <div className={`${styles.grid} ${styles.head}`} role="row">
          <span>Code</span>
          <span>Title</span>
          <span>Category</span>
          <span>Missing fields</span>
          <span>Code status</span>
          <span />
        </div>

        {rows.map((r) => (
          <div key={r.id ?? r.code} className={`${styles.grid} ${styles.row}`} role="row">
            <span className={styles.code}>{r.code}</span>
            <span>{r.title}</span>
            <span>{r.category}</span>
            <span className={styles.chips}>
              {(r.missing || []).map((m) => (
                <span key={m} className={styles.chipRed}>{m}</span>
              ))}
            </span>
            <span>
              <span className={`${styles.chip} ${r.status === "Confirmed" ? styles.chipOk : styles.chipWarn}`}>
                {r.status}
              </span>
            </span>
            <span className={styles.fixCell}>
              <button type="button" className={styles.fixBtn} onClick={() => onFix?.(r)}>
                <PencilIcon /> Fix
              </button>
            </span>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <p>Showing {start}–{end} of {total}</p>
        <div className={styles.pager}>
          <button type="button" onClick={onPrevious} disabled={page <= 1}>Previous</button>
          <button type="button" onClick={onNext} disabled={end >= total}>Next</button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Empty state: nothing is missing ---------------- */

export function AllCompleteBanner() {
  return (
    <div className={styles.allDone}>
      <span className={styles.tick} aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="m5 12.5 4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div>
        <p className={styles.allDoneTitle}>All registered records are complete.</p>
        <p className={styles.allDoneText}>New gaps appear here automatically after each sync or edit.</p>
      </div>
    </div>
  );
}
