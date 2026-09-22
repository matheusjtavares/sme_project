import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h2>Bem-vindo ao sistema de vendas</h2>

      <p>
        Utilize o menu lateral para navegar entre as páginas de
        vendas e comissões.
      </p>
    </div>
  );
}