import { useEffect, useState } from "react";

import { listCustomers } from "@/services/customers";
import type { Customer } from "@/types/customers";

interface UseCustomersResult {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

export function useCustomers(): UseCustomersResult {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listCustomers()
      .then((data) => {
        if (active) setCustomers(data);
      })
      .catch(() => {
        if (active) setError("Não foi possível carregar os clientes.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { customers, loading, error };
}