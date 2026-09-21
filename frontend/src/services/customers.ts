import type { Customer } from "@/types/customers";

const mockCustomers: Customer[] = [
  { id: 1, name: "Jorge Lacerda dos Santos", email: "jorge.santos@email.com", phone: "(11) 98765-4321" },
  { id: 2, name: "Maria Aparecida Nogueira", email: "maria.nogueira@email.com", phone: "(11) 97654-3210" },
  { id: 3, name: "Pedro Henrique Alves", email: "pedro.alves@email.com", phone: "(11) 96543-2109" },
  { id: 4, name: "Ana Beatriz Costa", email: "ana.costa@email.com", phone: "(11) 95432-1098" },
  { id: 5, name: "João Pedro Martins", email: "joao.martins@email.com", phone: "(11) 94321-0987" },
];

export function listCustomers(): Promise<Customer[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCustomers), 400);
  });
}