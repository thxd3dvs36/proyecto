"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Home, Users, ShoppingCart, Package, Calendar } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-full border-r bg-slate-50 md:w-64">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-semibold text-pink-600">Tiny Town</h1> {/* Nombre cambiado */}
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {["dashboard", "clients", "sales", "products", "events"].map((tab) => (
            <li key={tab}>
              <Button
                onClick={() => setActiveTab(tab)}
                className={`flex w-full items-center rounded-md px-4 py-2 text-slate-700 transition-colors hover:bg-slate-100 ${
                  activeTab === tab ? "bg-pink-100 text-pink-700 hover:bg-pink-200" : ""
                }`}
                variant="ghost"
              >
                {{
                  dashboard: <Home className="mr-2 h-5 w-5" />,
                  clients: <Users className="mr-2 h-5 w-5" />,
                  sales: <ShoppingCart className="mr-2 h-5 w-5" />,
                  products: <Package className="mr-2 h-5 w-5" />,
                  events: <Calendar className="mr-2 h-5 w-5" />,
                }[tab]}
                {tab === "dashboard" ? "Panel" : 
                 tab === "clients" ? "Clientes" :
                 tab === "sales" ? "Ventas" :
                 tab === "products" ? "Productos" : 
                 "Eventos"} {/* Traducción */}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};