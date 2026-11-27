"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebard";
import TopBar from "../components/TopBar";
import { TemplateList, TemplateForm } from "../components/TemplateParts";
import shell from "@/Assets/css/Dashboard.module.css";
import styles from "@/Assets/css/ReportTemplates.module.css";

/**
 * Report Templates page.
 *
 * role: "admin" | "staff"
 * user: { name, roleLabel }
 * onNavigate(page): called by the sidebar to switch pages
 * data:
 *   templates:    [{ id, name, type, placeholders, status: "Active" | "Inactive" }]
 *   selectedId:   id of the template being edited (leave out to add a new one)
 *   values:       { docTemplate, name, type, folder, category, purpose }  (form values)
 *   placeholders: [{ token, label, source, dataType, required }]          (found in the Google Doc)
 *   options:      { docTemplates, types, folders, categories, purposes, sources }  (arrays of strings)
 *   onSelect(id), onAdd(), onChooseFromDrive(), onRescan(), onCancel(), onSave({ values, placeholders })
 */
export default function ReportTemplates({ role = "admin", user = {}, data = {}, onNavigate = () => {} }) {
  const {
    templates = [],
    selectedId = null,
    values,
    placeholders,
    options = {},
    onSelect,
    onAdd,
    onChooseFromDrive,
    onRescan,
    onCancel,
    onSave,
  } = data;

  return (
    <div className={shell.shell}>
      <Sidebar role={role} active="templates" user={user} onNavigate={onNavigate} />

      <div className={shell.main}>
        <TopBar section="Reports" page="Report Templates" user={user} />
        <main className={shell.content}>
          <div className={styles.page}>
            <div className={styles.titleRow}>
              <div>
                <h1 className={styles.title}>Report Templates</h1>
                <p className={styles.subtitle}>Connect Google Docs templates and map their placeholders to system data.</p>
              </div>
              <button type="button" className={styles.addBtn} onClick={() => onAdd?.()}>
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Add template
              </button>
            </div>

            <div className={styles.columns}>
              <TemplateList templates={templates} selectedId={selectedId} onSelect={onSelect} />
              <TemplateForm
                key={selectedId ?? "new"}
                initialValues={values}
                initialPlaceholders={placeholders}
                options={options}
                isNew={selectedId == null}
                onChooseFromDrive={onChooseFromDrive}
                onRescan={onRescan}
                onCancel={onCancel}
                onSave={onSave}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
