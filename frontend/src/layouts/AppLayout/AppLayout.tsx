import { useState } from "react";
import { Outlet } from "react-router-dom";

import styles from "./AppLayout.module.css";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.app}>
      <AppHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
      />

      <div className={styles.body}>
        <AppSidebar open={sidebarOpen} />

        <main className={styles.dashboard}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}