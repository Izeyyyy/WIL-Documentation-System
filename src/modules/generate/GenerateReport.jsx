"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebard";
import TopBar from "../components/TopBar";
import { Step, TemplatePicker, ReportForm, AttachedDocs, MissingAlert, GenerateCard, ResultCard } from "../components/GenerateParts";
import shell from "@/Assets/css/Dashboard.module.css";
import styles from "@/Assets/css/GenerateReport.module.css";

// The Event Accomplishment Report fields from the design. Pass `fields` to use
// another template's inputs: [{ name, label, required, type: "text" | "date" | "number" | "select" | "readonly", placeholder }]
const DEFAULT_FIELDS = [
  { name: "eventTitle", label: "Event title", required: true },
  { name: "eventDate", label: "Event date", required: true, type: "date" },
  { name: "venue", label: "Venue", required: true },
  { name: "participants", label: "Number of participants", required: true, type: "number", placeholder: "Enter a number" },
  { name: "program", label: "Program", required: true, placeholder: "Enter the program" },
  { name: "preparedBy", label: "Prepared by", type: "readonly" },
];

const DEFAULT_TEMPLATES = [
  { id: "event", name: "Event Accomplishment Report" },
  { id: "terminal", name: "Terminal Report" },
  { id: "summary", name: "Program Summary" },
];

/**
 * Generate Report page.
 *
 * role: "admin" | "staff"
 * user: { name, roleLabel }
 * onNavigate(page): called by the sidebar to switch pages
 * data:
 *   templates: [{ id, name, inputs }]            (inputs = number of inputs)
 *   fields:    see DEFAULT_FIELDS above
 *   programs:  ["A2 – SpotLab", ...]             (options for select fields)
 *   attached:  [{ id, code, title }]             (related documents already chosen)
 *   reportsFolder: "Reports / Event Accomplishment"
 *   onTemplateChange(id), onAddDocuments(), onRemoveDocument(id)
 *   onGenerate(values, attached) -> Promise<{ code, title, status, location, createdAt, url }>
 */
export default function GenerateReport({ role = "staff", user = {}, data = {}, onNavigate = () => {} }) {
  const {
    templates = DEFAULT_TEMPLATES,
    fields = DEFAULT_FIELDS,
    programs = [],
    attached: initialAttached = [],
    reportsFolder,
    onTemplateChange,
    onAddDocuments,
    onRemoveDocument,
    onGenerate,
  } = data;

  const [templateId, setTemplateId] = useState(templates[0]?.id ?? null);
  const [values, setValues] = useState({});
  const [touched, setTouched] = useState({});
  const [attached, setAttached] = useState(initialAttached);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const missing = fields.filter((f) => f.required && !String(values[f.name] ?? "").trim());

  function setValue(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  function chooseTemplate(id) {
    setTemplateId(id);
    onTemplateChange?.(id);
  }

  function removeDoc(id) {
    setAttached((a) => a.filter((d) => d.id !== id));
    onRemoveDocument?.(id);
  }

  async function generate() {
    if (missing.length) {
      setTouched(Object.fromEntries(fields.map((f) => [f.name, true])));
      return;
    }
    setBusy(true);
    try {
      const created = await onGenerate?.(values, attached);
      if (created) setResult(created);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setResult(null);
    setValues({});
    setTouched({});
  }

  const form = {
    fields,
    values,
    touched,
    programs,
    preparedBy: user.name ? `${user.name} (you)` : "",
    onChange: setValue,
    onBlur: (name) => setTouched((t) => ({ ...t, [name]: true })),
  };

  return (
    <div className={shell.shell}>
      <Sidebar role={role} active="generate" user={user} onNavigate={onNavigate} />

      <div className={shell.main}>
        <TopBar section="Reports" page="Generate Report" user={user} />
        <main className={shell.content}>
          <div className={styles.page}>
            <h1 className={styles.title}>Generate Report</h1>
            <p className={styles.subtitle}>Fill in a template and create a new Google Doc in the reports folder.</p>

            <div className={styles.columns}>
              <section className={styles.card} aria-label="Report form">
                <Step n={1} title="Choose a template" />
                <TemplatePicker templates={templates} value={templateId} onChange={chooseTemplate} />

                <Step n={2} title="Fill in the report details" />
                <ReportForm {...form} />

                <Step n={3} title="Attach related documents" hint="(optional)" />
                <AttachedDocs items={attached} onRemove={removeDoc} onAdd={onAddDocuments} />
              </section>

              <aside className={styles.side}>
                <MissingAlert missing={missing} />
                <GenerateCard
                  disabled={missing.length > 0 || busy}
                  busy={busy}
                  folder={reportsFolder}
                  onGenerate={generate}
                />
                {result && <ResultCard result={result} onAnother={reset} />}
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}