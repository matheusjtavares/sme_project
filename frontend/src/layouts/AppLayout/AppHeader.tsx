import { useLocation } from "react-router-dom";

import styles from "./AppHeader.module.css";

interface AppHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

function resolveHeaderTitle(pathname: string): string {
  const editMatch = pathname.match(/^\/editsales\/([^/]+)$/);

  if (editMatch) {
    return `Alterar Venda - Nº ${editMatch[1]}`;
  }

  if (pathname.startsWith("/sales")) {
    return "Vendas";
  }

  if (pathname.startsWith("/commissions")) {
    return "Comissões";
  }

  return "Home";
}

export default function AppHeader({
  sidebarOpen,
  onToggleSidebar,
}: AppHeaderProps) {
  const location = useLocation();
  const headerTitle = resolveHeaderTitle(location.pathname);

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuButton}
        aria-label="Toggle menu"
        aria-expanded={sidebarOpen}
        onClick={onToggleSidebar}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={styles.logo}>
        <div className={styles.logoMark}>◉</div>

        <span className={styles.logoText}>logoipsum</span>
      </div>

      <h1 className={styles.headerTitle}>{headerTitle}</h1>
    </header>
  );
}