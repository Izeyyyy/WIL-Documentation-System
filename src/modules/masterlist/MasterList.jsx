import Sidebar from "../components/Sidebard";
import TopBar from "../components/TopBar";
import { PageHeader, Toolbar } from "../components/MasterListParts";
import { StaffTable, AdminExplorer } from "../components/MasterListViews";
import shell from "@/Assets/css/Dashboard.module.css";
import styles from "@/Assets/css/MasterList.module.css";

/**
 * Master List page (sidebar + top bar + list).
 *
 * role: "admin" | "staff"
 *   staff -> table of coded documents (Code, Title, Category, ...)
 *   admin -> file-explorer style list (folders, files, selection bar)
 * user:  { name, roleLabel }
 * data:  props for the list, see StaffTable / AdminExplorer
 * onNavigate: called with a page key from the sidebar
 */
export default function MasterList({
  role = "staff",
  user = {},
  data = {},
  onNavigate = (_page) => {},
}) {
  return (
    <div className={shell.shell}>
      <Sidebar role={role} active="masterlist" user={user} onNavigate={onNavigate} />

      <div className={shell.main}>
        <TopBar section="Find Documents" page="Master List" user={user} />
        <main className={shell.content}>
          <div className={styles.page}>
            <PageHeader />
            <Toolbar />
            {role === "admin" ? <AdminExplorer {...data} /> : <StaffTable {...data} />}
          </div>
        </main>
      </div>
    </div>
  );
}