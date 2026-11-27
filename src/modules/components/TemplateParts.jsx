"use client";

import { useState } from "react";
import styles from "@/Assets/css/TemplateParts.module.css";

const DEFAULT_SOURCES = ["User input", "Reference codes", "Document records"];

// Starter choices for the dropdowns, taken from the design. Pass `options` to the page
// (from your database or Google Drive) to replace any of these lists.
const DEFAULT_OPTIONS = {
  docTemplates: [
    "WIL Event Accomplishment Template (Google Doc)",
    "WIL Terminal Report Template (Google Doc)",
    "WIL Program Summary Template (Google Doc)",
  ],
  types: ["Event accomplishment report", "Terminal report", "Program summary"],
  folders: [
    "Reports / Event Accomplishment",
    "Reports / Terminal Reports",
    "Reports / Program Summaries",
  ],
  categories: [
    "ADM – Admin",
    "ARC – Archive",
    "EVL – Evaluation",
    "EVT – Event",
    "FIN – Finance",
    "MED – Media",
    "SUB – Submission",
  ],
  purposes: ["SpotLab", "LaunchLab", "TBI Basics", "Nexus", "TEC", "Government", "Others"],
};

// Use the list passed in when it has items, otherwise the starter list.
function withDefaults(options = {}) {
  const merged = { ...DEFAULT_OPTIONS };
  for (const key of Object.keys(DEFAULT_OPTIONS)) {
    if (Array.isArray(options[key]) && options[key].length) merged[key] = options[key];
  }
  merged.sources = options.sources?.length ? options.sources : DEFAULT_SOURCES;
  return merged;
}

function Chevron() {
  return (
    <svg className={styles.chev} width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- Left card: list of templates ---------------- */

/** templates: [{ id, name, type, placeholders, status }]  selectedId null = a new, unsaved template */
export function TemplateList({ templates = [], selectedId, onSelect }) {
  const isNew = selectedId == null;

  return (
    <section className={styles.listCard} aria-label="Templates">
      <h2 className={styles.listTitle}>Templates ({templates.length})</h2>

      <ul className={styles.list}>
        {templates.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              className={`${styles.item} ${t.id === selectedId ? styles.itemOn : ""}`}
              onClick={() => onSelect?.(t.id)}
              aria-current={t.id === selectedId ? "true" : undefined}
            >
              <span className={styles.itemTop}>
                <span className={styles.itemName}>{t.name}</span>
                <span className={`${styles.chip} ${t.status === "Active" ? styles.chipActive : styles.chipDraft}`}>
                  {t.status}
                </span>
              </span>
              <span className={styles.itemMeta}>
                {t.type} · {t.placeholders} placeholders
              </span>
            </button>
          </li>
        ))}

        {isNew && (
          <li>
            <div className={`${styles.item} ${styles.itemOn} ${styles.itemDraft}`}>
              <span className={styles.itemTop}>
                <span className={styles.itemName}>New template</span>
                <span className={`${styles.chip} ${styles.chipDraft}`}>Draft</span>
              </span>
              <span className={styles.itemMeta}>Not saved yet</span>
            </div>
          </li>
        )}
      </ul>
    </section>
  );
}

/* ---------------- Right card: add / edit a template ---------------- */

function SelectField({ label, name, required, options = [], emptyLabel = "—", value, onChange, className }) {
  return (
    <label className={`${styles.field} ${className || ""}`}>
      <span className={styles.label}>
        {label} {required && <b className={styles.req}>*</b>}
      </span>
      <span className={styles.selectWrap}>
        <select value={value} onChange={(e) => onChange(name, e.target.value)}>
          <option value="">{emptyLabel}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <Chevron />
      </span>
    </label>
  );
}

export function TemplateForm({
  initialValues = {},
  initialPlaceholders = [],
  options = {},
  isNew = true,
  onChooseFromDrive,
  onRescan,
  onCancel,
  onSave,
}) {
  const [values, setValues] = useState({
    docTemplate: "",
    name: "",
    type: "",
    folder: "",
    category: "",
    purpose: "",
    ...initialValues,
  });
  const [rows, setRows] = useState(initialPlaceholders);

  const opts = withDefaults(options);
  const sources = opts.sources;
  const canSave = ["docTemplate", "name", "type", "folder", "category"].every((k) => String(values[k] ?? "").trim());

  function set(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  function setSource(index, source) {
    setRows((r) => r.map((row, i) => (i === index ? { ...row, source } : row)));
  }

  return (
    <section className={styles.formCard} aria-label={isNew ? "Add template" : "Edit template"}>
      <h2 className={styles.formTitle}>{isNew ? "Add template" : "Edit template"}</h2>

      <div className={styles.form}>
        <div className={styles.docRow}>
          <SelectField label="Google Doc template" name="docTemplate" required options={opts.docTemplates}
            value={values.docTemplate} onChange={set} />
          <button type="button" className={styles.driveBtn} onClick={() => onChooseFromDrive?.()}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            Choose from Drive
          </button>
        </div>

        <div className={styles.twoCols}>
          <label className={styles.field}>
            <span className={styles.label}>Template name <b className={styles.req}>*</b></span>
            <input type="text" value={values.name} onChange={(e) => set("name", e.target.value)} />
          </label>
          <SelectField label="Report type" name="type" required options={opts.types}
            value={values.type} onChange={set} />
        </div>

        <div className={styles.threeCols}>
          <SelectField label="Output folder" name="folder" required options={opts.folders}
            value={values.folder} onChange={set} />
          <SelectField label="Default category" name="category" required options={opts.categories}
            value={values.category} onChange={set} />
          <SelectField label="Default purpose" name="purpose" options={opts.purposes}
            emptyLabel="Chosen when generating" value={values.purpose} onChange={set} />
        </div>
      </div>

      <div className={styles.phHead}>
        <h3>
          Placeholders found in the template <span className={styles.found}>{rows.length} found</span>
        </h3>
        <button type="button" className={styles.rescanBtn} onClick={() => onRescan?.()}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Rescan template
        </button>
      </div>

      <div className={styles.table}>
        <div className={`${styles.tRow} ${styles.tHead}`}>
          <span>Placeholder in the Doc</span>
          <span>Label shown to users</span>
          <span>Value comes from</span>
          <span>Data type</span>
          <span>Required</span>
        </div>

        {rows.length === 0 ? (
          <p className={styles.empty}>No placeholders yet. Choose a Google Doc template to scan it.</p>
        ) : (
          rows.map((r, i) => (
            <div key={r.token} className={styles.tRow}>
              <span className={styles.token}>{r.token}</span>
              <span>{r.label}</span>
              <span className={styles.selectWrap}>
                <select value={r.source} onChange={(e) => setSource(i, e.target.value)} aria-label={`Value for ${r.token}`}>
                  {sources.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <Chevron />
              </span>
              <span>{r.dataType}</span>
              <span>
                <span className={`${styles.reqChip} ${r.required ? styles.reqOn : styles.reqOff}`}>
                  {r.required ? "Required" : "Optional"}
                </span>
              </span>
            </div>
          ))
        )}
      </div>

      <div className={styles.footer}>
        <p>Placeholders are written as {"{{name}}"} inside the Google Doc.</p>
        <div className={styles.footerBtns}>
          <button type="button" className={styles.cancelBtn} onClick={() => onCancel?.()}>
            Cancel
          </button>
          <button type="button" className={styles.saveBtn} disabled={!canSave} onClick={() => onSave?.({ values, placeholders: rows })}>
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m5 12.5 4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Save template
          </button>
        </div>
      </div>
    </section>
  );
}