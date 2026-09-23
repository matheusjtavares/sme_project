import { Fragment, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { useSales } from "@/hooks/useSales";
import { deleteSale } from "@/services/sales";
import type { Sale } from "@/types/sales";
import styles from "./SalesTable.module.css";
import { NavLink } from "react-router-dom";
import { formatCurrency } from "@/utils/format";

const percentFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const datetimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function formatDateTime(iso: string): string {
  return datetimeFormatter.format(new Date(iso)).replace(" ", " - ");
}

function SalesTable() {
  const { sales, loading, error, removeSale } = useSales();
  const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleDelete() {
    if (!saleToDelete) return;

    setDeleting(true);
    setDeleteError(null);

    deleteSale(saleToDelete.id)
      .then(() => {
        removeSale(saleToDelete.id);
        setSaleToDelete(null);
      })
      .catch(() => {
        setDeleteError("Não foi possível excluir a venda.");
      })
      .finally(() => {
        setDeleting(false);
      });
  }

  return (
    <div className={styles.tableWrapper}>
      <Table className={styles.table}>
        <thead>
          <tr>
            <th>Nota Fiscal</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Data da Venda</th>
            <th className="text-center">Valor Total</th>
            <th className="text-center">Opções</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={6}
                className="text-center text-secondary"
              >
                Carregando vendas...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} className="text-center">
                <span className="text-danger">{error}</span>
              </td>
            </tr>
          ) : (
            sales.map((sale) => {
              const expanded = expandedSaleId === sale.id;

              return (
                <Fragment key={sale.id}>
                  <tr>
                    <td>{sale.invoice_number}</td>

                    <td>{sale.customer_name}</td>

                    <td>{sale.seller_name}</td>

                    <td>{formatDateTime(sale.sold_at)}</td>

                    <td className="text-center">
                      {formatCurrency(sale.total)}
                    </td>

                    <td className="text-center">
                      <Button
                        variant="link"
                        className="p-0 fw-bold me-4"
                        aria-expanded={expanded}
                        onClick={() =>
                          setExpandedSaleId(expanded ? null : sale.id)
                        }
                      >
                        {expanded ? "Fechar" : "Ver itens"}
                      </Button>

                      <span className="d-inline-flex align-items-center gap-3">
                        <NavLink
                          to={`/sales/edit/${sale.id}`}
                          className="btn btn-link p-0 text-decoration-none"
                          aria-label="Editar venda"
                        >
                          <BsPencilSquare />
                        </NavLink>

                        <Button
                          type="button"
                          variant="link"
                          className="p-0 text-danger text-decoration-none"
                          aria-label="Excluir venda"
                          onClick={() => setSaleToDelete(sale)}
                        >
                          <FaTrash />
                        </Button>
                      </span>
                    </td>
                  </tr>

                  {expanded && (
                    <tr className={styles.itemsRow}>
                      <td colSpan={6}>
                        <Table className={styles.itemsTable}>
                          <thead>
                            <tr>
                              <th>Produto/Serviço</th>
                              <th>Quantidade</th>
                              <th>Preço unitário</th>
                              <th>Total do produto</th>
                              <th>% de comissão</th>
                              <th>Comissão</th>
                            </tr>
                          </thead>

                          <tbody>
                            {sale.items.map((item) => (
                              <tr key={item.id}>
                                <td>{item.product} - {item.product_name}</td>

                                <td>{item.quantity}</td>

                                <td>
                                  {formatCurrency(item.unit_price)}
                                </td>

                                <td>
                                  {formatCurrency(
                                    item.quantity * Number(item.unit_price),
                                  )}
                                </td>

                                <td>
                                  {percentFormatter.format(
                                    Number(item.commission_percent) / 100,
                                  )}
                                </td>

                                <td>
                                  {formatCurrency(item.commission)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })
          )}
        </tbody>
      </Table>

      <Modal
        show={saleToDelete !== null}
        onHide={() => {
          if (!deleting) setSaleToDelete(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Excluir venda</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="mb-0">
            Tem certeza que deseja excluir permanentemente a venda{" "}
            <strong>{saleToDelete?.invoice_number}</strong>? Esta ação não pode
            ser desfeita.
          </p>

          {deleteError && (
            <span className="d-block mt-3 text-danger">{deleteError}</span>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setSaleToDelete(null)}
            disabled={deleting}
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SalesTable;