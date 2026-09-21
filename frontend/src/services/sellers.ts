import type { Seller } from "@/types/sellers";

const mockSellers: Seller[] = [
  { id: 1, name: "Regina Souza", email: "regina.souza@email.com", phone: "(11) 98888-1111" },
  { id: 2, name: "Carlos Pereira", email: "carlos.pereira@email.com", phone: "(11) 97777-2222" },
  { id: 3, name: "Fernanda Lima", email: "fernanda.lima@email.com", phone: "(11) 96666-3333" },
];

export function listSellers(): Promise<Seller[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSellers), 400);
  });
}