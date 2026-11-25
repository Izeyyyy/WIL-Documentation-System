import Icon from "./Icons";
import styles from "../../../Assets/css/TopBar.module.css";
function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

/**
 * @param {{ section?: string, page?: string, user?: { name?: string, roleLabel?: string } }} props
 */
export default function TopBar({ section = "Find Documents", page = "Dashboard", user = {} }) {
  return (
    <header className={styles.topbar}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <span>{section}</span>
        <span className={styles.slash}>/</span>
        <span>{page}</span>
      </nav>

      <div className={styles.actions}>
        <label className={styles.search}>
          <Icon name="search" className={styles.searchIcon} />
          <input type="search" placeholder="Search by code, title, or keyword" />
        </label>

        <button type="button" className={styles.bell} aria-label="Notifications">
          <Icon name="bell" size={18} />
        </button>

        <span className={styles.divider} aria-hidden="true" />

        <div className={styles.user}>
          <span className={styles.avatar}>{initials(user.name) || "—"}</span>
          <div>
            <p className={styles.userName}>{user.name || "—"}</p>
            <p className={styles.userRole}>{user.roleLabel || ""}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
