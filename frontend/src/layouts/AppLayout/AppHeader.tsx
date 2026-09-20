import styles from "./AppHeader.module.css";

interface AppHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function AppHeader({
  sidebarOpen,
  onToggleSidebar,
}: AppHeaderProps) {
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

      <h1 className={styles.headerTitle}>Vendas</h1>
    </header>
  );
}