import { useEffect, useState } from "react";

import { listSellers } from "@/services/sellers";
import type { Seller } from "@/types/sellers";

interface UseSellersResult {
  sellers: Seller[];
  loading: boolean;
  error: string | null;
}

export function useSellers(): UseSellersResult {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listSellers()
      .then((data) => {
        if (active) setSellers(data);
      })
      .catch(() => {
        if (active) setError("Não foi possível carregar os vendedores.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { sellers, loading, error };
}