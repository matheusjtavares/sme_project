import { useCallback, useEffect, useState } from "react";

import { listSales } from "@/services/sales";
import type { Sale } from "@/types/sales";

interface UseSalesResult {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  removeSale: (id: number) => void;
}

export function useSales(): UseSalesResult {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listSales()
      .then((data) => {
        if (active) setSales(data);
      })
      .catch(() => {
        if (active) setError("Não foi possível carregar as vendas.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const removeSale = useCallback((id: number) => {
    setSales((current) => current.filter((sale) => sale.id !== id));
  }, []);

  return { sales, loading, error, removeSale };
}