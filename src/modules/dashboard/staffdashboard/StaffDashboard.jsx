import {
  PageHeader,
  StatCards,
  CategoryChart,
  PurposeChart,
  SyncStatus,
  RecordsTable,
} from "../../components/DashboardWidgets";
import styles from "../../../Assets/css/StaffDashboard.module.css";

export default function StaffDashboard({ stats, 
    categories, 
    purposes, 
    sync, 
    records, 
    onSyncNow }) {
  return (
    <div className={styles.page}>
      <PageHeader />
      <StatCards stats={stats} />

      <div className={styles.chartRow}>
        <CategoryChart items={categories} />
        <PurposeChart items={purposes} />
        <SyncStatus sync={sync} onSyncNow={onSyncNow} />
      </div>

      <RecordsTable rows={records} />
    </div>
  );
}
