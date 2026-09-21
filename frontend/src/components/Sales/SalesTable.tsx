import Table from "react-bootstrap/Table";
import { BsPencil, BsTrash } from "react-icons/bs";
import styles from "./SalesTable.module.css";

function SalesTable() {
  return (
    <div className={styles.tableWrapper}>
      <Table className={styles.table}>
        <thead>
          <tr>
            <th>Nota Fiscal</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Data da Venda</th>
            <th>Valor Total</th>
            <th>Opções</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>00001005</td>

            <td>Jorge Lacerda dos Santos</td>

            <td>Regina Souza</td>

            <td>19/10/2022 - 14:25</td>

            <td>R$ 71,10</td>

            <td>
              <button type="button" className={styles.viewItems}>
                Ver itens
              </button>

              <button
                type="button"
                className={`${styles.actionButton} ${styles.editButton}`}
                aria-label="Editar venda"
              >
                <BsPencil />
              </button>

              <button
                type="button"
                className={`${styles.actionButton} ${styles.deleteButton}`}
                aria-label="Excluir venda"
              >
                <BsTrash />
              </button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default SalesTable;