import { createContext, useContext, useState, ReactNode } from "react";

interface AdminAuthContextType {
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAdmin: false,
  login: () => false,
  logout: () => {},
});

const ADMIN_EMAIL = "admin@clang.store";
const ADMIN_PASSWORD = "clang2025";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem("clang-admin") === "true";
  });

  const login = (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem("clang-admin", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("clang-admin");
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminAuthContext);
