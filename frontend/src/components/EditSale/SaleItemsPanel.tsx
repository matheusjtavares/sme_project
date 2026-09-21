import { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Autocomplete, {
  type AutocompleteOption,
} from "@/components/Autocomplete";
import styles from "./SaleItemsPanel.module.css";
import { formatCurrency } from "@/utils/format";
import type { Product } from "@/types/products";
import type { SaleItem } from "@/types/saleitems";

interface SaleItemsPanelProps {
  items: SaleItem[];
  products: Product[];
}

function toAutocompleteOptions(products: Product[]): AutocompleteOption[] {
  return products.map((product) => ({
    value: product.id,
    label: product.description,
    searchText: `${product.code} ${product.description}`,
  }));
}

function SaleItemsPanel({ items, products }: SaleItemsPanelProps) {
  const [selectedProduct, setSelectedProduct] =
    useState<AutocompleteOption | null>(null);

  return (
    <div className={styles.panel}>
      <h2 className={styles.panelTitle}>Produtos</h2>

      <div className={styles.addRow}>
        <div className={styles.field}>
          <Form.Label className={styles.label}>Produto</Form.Label>

          <Autocomplete
            options={toAutocompleteOptions(products)}
            selected={selectedProduct}
            onSelect={setSelectedProduct}
            placeholder="Busque um produto por código ou descrição"
            emptyMessage="Nenhum produto encontrado"
          />
        </div>

        <div className={styles.fieldQty}>
          <Form.Label className={styles.label}>Quantidade</Form.Label>

          <Form.Control type="number" min={1} defaultValue={1} />
        </div>

        <Button type="button" variant="primary" className={styles.addButton}>
          Adicionar
        </Button>
      </div>

      <Table className={styles.table}>
        <thead>
          <tr>
            <th>Produto/Serviço</th>
            <th>Quantidade</th>
            <th>Preço unitário</th>
            <th>Total</th>
            <th aria-label="Excluir" />
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.emptyCell}>
                Nenhum item adicionado.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>

                <td>{item.quantity}</td>

                <td>{formatCurrency(item.unit_price)}</td>

                <td>
                  {formatCurrency(item.quantity * Number(item.unit_price))}
                </td>

                <td />
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default SaleItemsPanel;