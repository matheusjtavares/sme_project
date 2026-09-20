import { NavLink } from "react-router-dom";

import styles from "./AppSidebar.module.css";

interface AppSidebarProps {
  open: boolean;
}

export default function AppSidebar({ open }: AppSidebarProps) {
  const sidebarClassName = open
    ? `${styles.sidebar} ${styles.sidebarOpen}`
    : `${styles.sidebar} ${styles.sidebarClosed}`;

  return (
    <aside className={sidebarClassName}>
      <nav>
        <NavLink
          to="/sales"
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.itemActive : ""}`
          }
        >
          <span className={styles.itemIcon}>▣</span>

          <span>Vendas</span>

          <span className={styles.chevron}>›</span>
        </NavLink>

        <NavLink
          to="/commissions"
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.itemActive : ""}`
          }
        >
          <span className={styles.itemIcon}>▦</span>

          <span>Comissões</span>

          <span className={styles.chevron}>›</span>
        </NavLink>
      </nav>
    </aside>
  );
}