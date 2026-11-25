import LoginForm from "@/modules/login/LoginForm";
import Dashboard from "@/modules/dashboard/Dashboard";

export default function Home() {
  const isLoggedIn = true; // set to false to see the login page

  return isLoggedIn ? <Dashboard role="admin" /> : <LoginForm />;
}