"use client";

import Link from "next/link";
import Icon from "./Icons";
import styles from "@/Assets/css/DashboardWidgets.module.css";

/* ---------------- Page header ---------------- */

export function PageHeader({ title = "Dashboard", subtitle = "Your workspace, at a glance." }) {
  return (
    <div className={styles.pageHeader}>
      <div>
        <h1 className={styles.pageTitle}>{title}</h1>
        <p className={styles.pageSubtitle}>{subtitle}</p>
      </div>
      <Link href="/dashboard/generate-report" className={styles.primaryBtn}>
        <Icon name="download" size={14} />
        Generate Report
      </Link>
    </div>
  );
}

/* ---------------- Stat cards ---------------- */

// The four cards from the design. Pass `stats` to fill them in, in this order:
// [{ value, delta, note }, ...]
const STAT_LABELS = ["Total documents", "Pending approvals", "Shared with you", "Storage used"];

export function StatCards({ stats = [] }) {
  return (
    <div className={styles.statGrid}>
      {STAT_LABELS.map((label, index) => {
        const stat = stats[index] || {};
        return (
          <section key={label} className={styles.card + " " + styles.statCard}>
            <p className={styles.statLabel}>{label}</p>
            <p className={styles.statValue}>{stat.value ?? "—"}</p>
            <p className={styles.statFoot}>
              {stat.delta ? <strong>{stat.delta}</strong> : null}
              {stat.note ? <span>{stat.note}</span> : null}
            </p>
          </section>
        );
      })}
    </div>
  );
}

/* ---------------- Charts ---------------- */

function EmptyState({ children = "No data yet" }) {
  return <p className={styles.empty}>{children}</p>;
}

// items: [{ label, value }]
export function CategoryChart({ title = "Documents by Category", items = [] }) {
  const max = Math.max(0, ...items.map((item) => item.value));

  return (
    <section className={styles.card + " " + styles.chartCard}>
      <h2 className={styles.cardTitle}>{title}</h2>
      {items.length === 0 || max === 0 ? (
        <EmptyState />
      ) : (
        <div className={styles.columns}>
          {items.map((item) => (
            <div key={item.label} className={styles.column}>
              <span className={styles.columnValue}>{item.value}</span>
              <div className={styles.columnTrack}>
                <div className={styles.columnBar} style={{ height: `${(item.value / max) * 100}%` }} />
              </div>
              <span className={styles.columnLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// items: [{ label, value }]
export function PurposeChart({ title = "Documents by purpose", items = [] }) {
  const max = Math.max(0, ...items.map((item) => item.value));

  return (
    <section className={styles.card + " " + styles.chartCard}>
      <h2 className={styles.cardTitle}>{title}</h2>
      {items.length === 0 || max === 0 ? (
        <EmptyState />
      ) : (
        <ul className={styles.bars}>
          {items.map((item) => (
            <li key={item.label} className={styles.barRow}>
              <span className={styles.barLabel}>{item.label}</span>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${(item.value / max) * 100}%` }} />
              </div>
              <span className={styles.barValue}>{item.value}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ---------------- Sync status ---------------- */

// sync: { status, lastSync, changes, removed, nextSync }   (all optional)
export function SyncStatus({ sync = {}, onSyncNow }) {
  const rows = [
    { label: "Last Sync", value: sync.lastSync },
    { label: "Changes", value: sync.changes },
    { label: "Removed from Device", value: sync.removed, big: true },
    { label: "Next Sync", value: sync.nextSync },
  ];

  return (
    <section className={styles.card + " " + styles.syncCard}>
      <div className={styles.syncHead}>
        <h2 className={styles.syncTitle}>Sync Status</h2>
        {sync.status ? <span className={styles.syncPill}>{sync.status}</span> : null}
      </div>

      <dl className={styles.syncList}>
        {rows.map((row) => (
          <div key={row.label} className={styles.syncRow}>
            <dt>{row.label}</dt>
            <dd className={row.big ? styles.syncBig : undefined}>{row.value ?? "—"}</dd>
          </div>
        ))}
      </dl>

      <button type="button" className={styles.syncBtn} onClick={onSyncNow}>
        <Icon name="refresh" size={20} />
        Sync Now
      </button>
    </section>
  );
}

/* ---------------- Tables ---------------- */

const FILE_TONES = {
  PDF: styles.filePdf,
  DOC: styles.fileDoc,
  XLS: styles.fileXls,
};

const DOC_STATUS_TONES = {
  approved: styles.chipApproved,
  "in review": styles.chipReview,
  draft: styles.chipDraft,
};

// rows: [{ name, location, type, category, purpose, status }]
export function RecentDocuments({ rows = [] }) {
  return (
    <section className={styles.card + " " + styles.tableCard}>
      <div className={styles.tableHead}>
        <h2 className={styles.cardTitle}>Recent documents</h2>
        <Link href="/dashboard/masterlist" className={styles.viewAll}>
          View all <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className={styles.scroll}>
        <div className={`${styles.docRow} ${styles.docHeader}`}>
          <span>Name</span>
          <span>Category</span>
          <span>Purpose</span>
          <span>Status</span>
        </div>

        {rows.length === 0 ? (
          <p className={styles.emptyRow}>No documents yet</p>
        ) : (
          rows.map((row, index) => (
            <div key={row.id ?? index} className={`${styles.docRow} ${styles.docBody}`}>
              <div className={styles.docName}>
                <span className={`${styles.fileBadge} ${FILE_TONES[row.type] || ""}`}>{row.type}</span>
                <div>
                  <p className={styles.docTitle}>{row.name}</p>
                  <p className={styles.docSub}>{row.location}</p>
                </div>
              </div>
              <span className={styles.cellText}>{row.category}</span>
              <span className={styles.cellText}>{row.purpose}</span>
              <span>
                <span className={`${styles.chip} ${DOC_STATUS_TONES[String(row.status).toLowerCase()] || ""}`}>
                  {row.status}
                </span>
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

const CODE_STATUS_TONES = {
  provisional: styles.chipProvisional,
  confirmed: styles.chipConfirmed,
};

// rows: [{ code, title, category, purpose, date, codeStatus }]
export function RecordsTable({ rows = [] }) {
  return (
    <section className={styles.recordsCard}>
      <div className={styles.scroll}>
        <div className={`${styles.recRow} ${styles.recHeader}`}>
          <span>Code</span>
          <span>Title</span>
          <span>Category</span>
          <span>Purpose</span>
          <span>Document Date</span>
          <span>Code status</span>
        </div>

        {rows.length === 0 ? (
          <p className={styles.emptyRow}>No records yet</p>
        ) : (
          rows.map((row, index) => (
            <div key={row.code ?? index} className={`${styles.recRow} ${styles.recBody}`}>
              <span className={styles.recCode}>{row.code}</span>
              <span>{row.title}</span>
              <span>{row.category}</span>
              <span>{row.purpose}</span>
              <span>{row.date}</span>
              <span>
                <span className={`${styles.chip} ${CODE_STATUS_TONES[String(row.codeStatus).toLowerCase()] || ""}`}>
                  {row.codeStatus}
                </span>
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
