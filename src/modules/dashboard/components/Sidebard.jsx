import Link from "next/link";
import Icon from "./Icons";
import logo from "../../../Assets/wildcat-logo.png";
import styles from "../../../Assets/css/Sidebar.module.css";

// Navigation, grouped like the Figma sidebar. `adminOnly` groups are hidden for staff.
const GROUPS = [
  {
    label: "Find documents",
    items: [
      { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { key: "masterlist", label: "Masterlist", href: "/dashboard/masterlist", icon: "list" },
    ],
  },
  {
    label: "Register documents",
    items: [
      { key: "review", label: "Review New Documents", href: "/dashboard/review-new-documents", icon: "inbox" },
      { key: "incomplete", label: "Incomplete Records", href: "/dashboard/incomplete-records", icon: "alert" },
    ],
  },
  {
    label: "Reports",
    items: [
      { key: "generate", label: "Generate Report", href: "/dashboard/generate-report", icon: "filePlus" },
      { key: "templates", label: "Report Templates", href: "/dashboard/report-templates", icon: "template" },
    ],
  },
  {
    label: "Administration",
    adminOnly: true,
    items: [
      { key: "users", label: "Users and Roles", href: "/dashboard/users-and-roles", icon: "users" },
      { key: "codes", label: "Reference Codes", href: "/dashboard/reference-codes", icon: "tag" },
      { key: "drive", label: "Drive Connection", href: "/dashboard/drive-connection", icon: "hardDrive" },
      { key: "audit", label: "Audit Log", href: "/dashboard/audit-log", icon: "clipboard" },
    ],
  },
];

/**
 * @param {{ role?: "admin" | "staff", active?: string, user?: { name?: string, roleLabel?: string } }} props
 */
export default function Sidebar({ role = "admin", active = "dashboard", user = {} }) {
  const groups = GROUPS.filter((group) => !group.adminOnly || role === "admin");

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={logo.src} alt="Wildcat Innovation Labs" className={styles.logoImg} />
      </div>

      <nav className={styles.nav} aria-label="Main">
        {groups.map((group) => (
          <div key={group.label} className={styles.group}>
            <p className={styles.groupLabel}>{group.label}</p>
            <ul className={styles.items}>
              {group.items.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={`${styles.item} ${item.key === active ? styles.itemActive : ""}`}
                    aria-current={item.key === active ? "page" : undefined}
                  >
                    <Icon name={item.icon} className={styles.itemIcon} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={styles.user}>
        <div className={styles.userText}>
          <p className={styles.userName}>{user.name || "—"}</p>
          <p className={styles.userRole}>{user.roleLabel || (role === "admin" ? "Administrator" : "Records Staff")}</p>
        </div>
        <Icon name="users" size={18} className={styles.userIcon} />
      </div>
    </aside>
  );
}
