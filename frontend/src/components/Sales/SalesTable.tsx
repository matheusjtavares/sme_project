import { Fragment, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { BsPencil, BsTrash } from "react-icons/bs";
import { useSales } from "@/hooks/useSales";
import styles from "./SalesTable.module.css";
import { NavLink } from "react-router-dom";
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

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
  const { sales, loading, error } = useSales();
  const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null);

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
                      {currencyFormatter.format(Number(sale.total))}
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
                          <BsPencil />
                        </NavLink>

                        <Button
                          type="button"
                          variant="link"
                          className="p-0 text-danger text-decoration-none"
                          aria-label="Excluir venda"
                        >
                          <BsTrash />
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
                                  {currencyFormatter.format(
                                    Number(item.unit_price),
                                  )}
                                </td>

                                <td>
                                  {currencyFormatter.format(
                                    item.quantity * Number(item.unit_price),
                                  )}
                                </td>

                                <td>
                                  {percentFormatter.format(
                                    Number(item.commission_percent) / 100,
                                  )}
                                </td>

                                <td>
                                  {currencyFormatter.format(
                                    Number(item.commission),
                                  )}
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
    </div>
  );
}

export default SalesTable;