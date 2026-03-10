import { Navigate } from "react-router-dom";
import { useAdmin } from "@/context/AdminAuthContext";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return <Navigate to="/admin-login" replace />;
  return <>{children}</>;
}
