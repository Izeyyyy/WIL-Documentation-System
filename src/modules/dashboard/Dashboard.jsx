import Sidebar from "./components/Sidebard";
import TopBar from "./components/TopBar";
import AdminDashboard from "./admindashboard/AdminDashboard";
import StaffDashboard from "./staffdashboard/StaffDashboard";
import styles from "../../Assets/css/Dashboard.module.css";

export default function Dashboard({
  role = "admin",
  user = {},
  data = {},
  onNavigate = (page) => {},
}) {
  const Content = role === "admin" ? AdminDashboard : StaffDashboard;

  return (
    <div className={styles.shell}>
      <Sidebar role={role} active="dashboard" user={user} onNavigate={onNavigate} />

      <div className={styles.main}>
        <TopBar section="Find Documents" page="Dashboard" user={user} />
        <main className={styles.content}>
          <Content {...data} />
        </main>
      </div>
    </div>
  );
}