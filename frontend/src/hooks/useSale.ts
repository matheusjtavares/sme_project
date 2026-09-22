import { useEffect, useState } from "react";

import { getSale } from "@/services/sales";
import type { Sale } from "@/types/sales";

interface UseSaleResult {
  sale: Sale | null;
  loading: boolean;
  error: string | null;
}

export function useSale(id: number): UseSaleResult {
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [loadedId, setLoadedId] = useState<number | null>(null);

  if (loadedId !== id) {
    setLoadedId(id);
    setSale(null);
    setLoading(true);
    setError(null);
  }

  useEffect(() => {
    let active = true;

    getSale(id)
      .then((data) => {
        if (active) setSale(data ?? null);
      })
      .catch(() => {
        if (active) setError("Não foi possível carregar a venda.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  return { sale, loading, error };
}