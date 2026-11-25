import {
  PageHeader,
  StatCards,
  CategoryChart,
  PurposeChart,
  SyncStatus,
  RecentDocuments,
} from "../components/DashboardWidgets";
import styles from "../../../Assets/css/AdminDashboard.module.css";

export default function AdminDashboard({
  stats,
  categories,
  purposes,
  sync,
  recentDocuments,
  onSyncNow,
}) {
  return (
    <div className={styles.page}>
      <PageHeader />
      <StatCards stats={stats} />

      <div className={styles.chartRow}>
        <CategoryChart items={categories} />
        <PurposeChart items={purposes} />
        <SyncStatus sync={sync} onSyncNow={onSyncNow} />
      </div>

      <RecentDocuments rows={recentDocuments} />
    </div>
  );
}
