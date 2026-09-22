import { Route, Routes } from "react-router-dom";

import RequireAuth from "@/auth/RequireAuth";
import AppLayout from "@/layouts/AppLayout";
import Commissions from "@/pages/Commissions";
import EditSales from "@/pages/EditSales";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NovaVenda from "@/pages/NovaVenda";
import Sales from "@/pages/Sales";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Home />} />
        <Route path="sales" element={<Sales />} />
        <Route path="sales/new" element={<NovaVenda />} />
        <Route path="commissions" element={<Commissions />} />
        <Route path="sales/edit/:id" element={<EditSales />} />
      </Route>
    </Routes>
  );
}