import LoginForm from "@/modules/login/LoginForm";
import Dashboard from "@/modules/dashboard/Dashboard";
import MasterList from "@/modules/masterlist/MasterList";

export default function Home() {
  const isLoggedIn = true;                // false shows the login page
  const page: "dashboard" | "masterlist" = "masterlist";
  const role = "staff";                   // or "admin"

  if (!isLoggedIn) return <LoginForm />;
  return page === "masterlist" ? <MasterList role={role} /> : <Dashboard role={role} />;
}