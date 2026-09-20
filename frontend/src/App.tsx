import { useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import "./App.css";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="app-logo">
          <div className="logo-mark">◉</div>

          <span className="logo-text">
            logoipsum
          </span>
        </div>

        <h1 className="header-title">
          Vendas
        </h1>
      </header>

      <div className="app-body">
        {/* Sidebar */}
        <aside
          className={`sidebar ${
            sidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <nav>
            <NavLink
              to="/sales"
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-item-icon">▣</span>

              <span>Vendas</span>

              <span className="sidebar-chevron">›</span>
            </NavLink>

            <NavLink
              to="/commissions"
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-item-icon">▦</span>

              <span>Comissões</span>

              <span className="sidebar-chevron">›</span>
            </NavLink>
          </nav>
        </aside>

        {/* Route content */}
        <main className="dashboard">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
function Home() {
  return (
    <div className="page">
      <h2>Bem-vindo ao sistema de vendas</h2>

      <p>
        Utilize o menu lateral para navegar entre as páginas de
        vendas e comissões.
      </p>
    </div>
  );
}

function Sales() {
  return (
    <div className="page">
      <h2>Vendas Realizadas</h2>
    </div>
  );
}

function Commissions() {
  return (
    <div className="page">
      <h2>Comissões</h2>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sales" element={<Sales />} />
          <Route
            path="/commissions"
            element={<Commissions />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}