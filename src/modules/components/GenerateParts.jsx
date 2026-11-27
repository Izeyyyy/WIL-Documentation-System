import styles from "@/Assets/css/GenerateParts.module.css";

/* ---------------- Small pieces ---------------- */

export function Step({ n, title, hint }) {
  return (
    <h2 className={styles.step}>
      <span className={styles.stepNum}>{n}</span>
      {title}
      {hint && <span className={styles.hint}>{hint}</span>}
    </h2>
  );
}

function Icon({ children, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const WarnIcon = () => (
  <Icon size={18}>
    <path d="M12 3.5 2.5 20h19L12 3.5z" />
    <path d="M12 10v5" />
    <circle cx="12" cy="17.6" r="1" fill="currentColor" />
  </Icon>
);

/* ---------------- Step 1: templates ---------------- */

/** templates: [{ id, name, inputs }] */
export function TemplatePicker({ templates = [], value, onChange }) {
  return (
    <div className={styles.templates} role="radiogroup" aria-label="Report template">
      {templates.map((t) => {
        const on = t.id === value;
        return (
          <label key={t.id} className={`${styles.template} ${on ? styles.templateOn : ""}`}>
            <input type="radio" name="template" checked={on} onChange={() => onChange?.(t.id)} />
            <span className={styles.radio} aria-hidden="true" />
            <span>
              <span className={styles.templateName}>{t.name}</span>
              <span className={styles.templateMeta}>{t.inputs ?? "—"} inputs · Google Doc</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}

/* ---------------- Step 2: form ---------------- */

export function ReportForm({ fields, values, touched, programs, preparedBy, onChange, onBlur }) {
  return (
    <div className={styles.form}>
      {fields.map((f) => {
        const value = values[f.name] ?? "";
        const empty = !String(value).trim();
        const showError = f.required && empty && touched[f.name];

        return (
          <label key={f.name} className={styles.field}>
            <span className={styles.label}>
              {f.label} {f.required && <b className={styles.req}>*</b>}
            </span>

            {f.type === "select" ? (
              <span className={styles.selectWrap}>
                <select value={value} onChange={(e) => onChange(f.name, e.target.value)} onBlur={() => onBlur(f.name)}
                  className={showError ? styles.invalid : undefined}>
                  <option value="" disabled>—</option>
                  {programs.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <svg className={styles.chev} width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            ) : f.type === "readonly" ? (
              <input type="text" value={preparedBy} readOnly className={styles.readonly} />
            ) : f.type === "date" ? (
              <input
                type="date"
                value={value}
                onChange={(e) => onChange(f.name, e.target.value)}
                onBlur={() => onBlur(f.name)}
                className={showError ? styles.invalid : undefined}
              />
            ) : f.type === "number" ? (
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={value}
                placeholder={f.placeholder}
                // keep digits only, so letters, spaces and symbols can't be typed or pasted
                onChange={(e) => onChange(f.name, e.target.value.replace(/\D/g, ""))}
                onBlur={() => onBlur(f.name)}
                className={showError ? styles.invalid : undefined}
              />
            ) : (
              <input
                type="text"
                value={value}
                placeholder={f.placeholder}
                onChange={(e) => onChange(f.name, e.target.value)}
                onBlur={() => onBlur(f.name)}
                className={showError ? styles.invalid : undefined}
              />
            )}

            {showError && <span className={styles.error}>Required</span>}
          </label>
        );
      })}
    </div>
  );
}

/* ---------------- Step 3: attached documents ---------------- */

/** items: [{ id, code, title }] */
export function AttachedDocs({ items = [], onRemove, onAdd }) {
  return (
    <div className={styles.attached}>
      {items.map((d) => (
        <div key={d.id} className={styles.doc}>
          <Icon size={15}>
            <rect x="5" y="3" width="14" height="18" rx="2.5" />
            <path d="M9 9h6M9 13h6M9 17h4" />
          </Icon>
          <span className={styles.docText}>
            <b>{d.code}</b> {d.title}
          </span>
          <button type="button" className={styles.remove} aria-label={`Remove ${d.code}`} onClick={() => onRemove?.(d.id)}>
            ×
          </button>
        </div>
      ))}

      <button type="button" className={styles.addBtn} onClick={() => onAdd?.()}>
        <Icon size={16}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </Icon>
        Add documents
      </button>
    </div>
  );
}

/* ---------------- Right column ---------------- */

export function MissingAlert({ missing = [] }) {
  if (missing.length === 0) return null;
  return (
    <div className={styles.alert} role="status">
      <p className={styles.alertTitle}>
        <WarnIcon /> Missing inputs ({missing.length})
      </p>
      <ul>
        {missing.map((m) => (
          <li key={m.name}>{m.label}</li>
        ))}
      </ul>
      <p className={styles.alertNote}>Fill in every required input to generate the report.</p>
    </div>
  );
}

export function GenerateCard({ disabled, busy, folder, onGenerate }) {
  return (
    <div className={styles.generate}>
      <button type="button" className={styles.generateBtn} disabled={disabled} onClick={onGenerate}>
        <Icon size={16}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5M12 11v6M9 14h6" />
        </Icon>
        {busy ? "Generating…" : "Generate report"}
      </button>
      <p className={styles.generateNote}>
        Creates a new Google Doc in <b>{folder || "the reports folder"}</b> and registers it with its own document code.
      </p>
    </div>
  );
}

/** result: { code, title, status, location, createdAt, url } */
export function ResultCard({ result, onAnother }) {
  return (
    <div className={styles.result}>
      <span className={styles.shown}>Shown after generating</span>
      <p className={styles.created}>
        <span className={styles.tick}>
          <Icon size={16}><path d="m5 12.5 4.5 4.5L19 7" strokeWidth="2.2" /></Icon>
        </span>
        Report created
      </p>
      <p className={styles.resultCode}>
        {result.code} <span className={styles.registered}>{result.status || "Registered"}</span>
      </p>
      <p className={styles.resultTitle}>{result.title}</p>
      <p className={styles.resultMeta}>
        {result.location} · {result.createdAt}
      </p>
      <a className={styles.openBtn} href={result.url || "#"} target="_blank" rel="noreferrer">
        <Icon size={16}>
          <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </Icon>
        Open in Google Docs
      </a>
      <button type="button" className={styles.anotherBtn} onClick={onAnother}>
        Generate another
      </button>
    </div>
  );
}