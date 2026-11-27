import Image from "next/image";
import Link from "next/link";
import Icon from "./Icons";
import styles from "@/Assets/css/Sidebar.module.css";
import logo from "@/Assets/wildcat-logo.png";

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

// Only these pages exist in page.tsx so far. Add keys here as you build more.
const AVAILABLE_PAGES = ["dashboard", "masterlist", "review"];

/**
 * @param {{
 *   role?: "admin" | "staff",
 *   active?: string,
 *   user?: { name?: string, roleLabel?: string },
 *   onNavigate?: (page: string) => void
 * }} props
 */
export default function Sidebar({
  role = "admin",
  active = "dashboard",
  user = {},
  onNavigate = () => {},
}) {
  const groups = GROUPS.filter((group) => !group.adminOnly || role === "admin");

  function handleClick(event, key) {
    event.preventDefault(); // stop the real navigation so the state isn't reset
    if (AVAILABLE_PAGES.includes(key)) onNavigate(key);
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Image src={logo} alt="Wildcat Innovation Labs" className={styles.logoImg} priority />
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
                    prefetch={false}
                    onClick={(event) => handleClick(event, item.key)}
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