import { Route, Routes } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import Commissions from "@/pages/Commissions";
import Home from "@/pages/Home";
import Sales from "@/pages/Sales";
import EditSales from "@/pages/EditSales";
import NovaVenda from "@/pages/NovaVenda";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="sales" element={<Sales />} />
        <Route path="sales/new" element={<NovaVenda />} />
        <Route path="commissions" element={<Commissions />} />
        <Route path="sales/edit/:id" element={<EditSales />} />
      </Route>
    </Routes>
  );
}