"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { SortableEvent } from "@/components/SortableEvent";
import { useFirestore } from "@/hooks/useFirestore";
import { Event, Client, Product, Invoice } from "@/types/types";
import { NewClientModal } from "@/components/modals/NewClientModal";
import { NewEventModal } from "@/components/modals/NewEventModal";
import { NewProductModal } from "@/components/modals/NewProductModal";
import { NewInvoiceModal } from "@/components/modals/NewInvoiceModal";
import { EditInvoiceModal } from "@/components/modals/EditInvoiceModal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [isEditInvoiceModalOpen, setIsEditInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Obtener datos de Firestore
  const { data: clients, loading: clientsLoading, error: clientsError } = useFirestore<Client>("clients");
  const { data: events, loading: eventsLoading, error: eventsError } = useFirestore<Event>("events");
  const { data: products, loading: productsLoading, error: productsError } = useFirestore<Product>("products");
  const { data: invoices, loading: invoicesLoading, error: invoicesError } = useFirestore<Invoice>("invoices");

  // Estado local para las facturas
  const [localInvoices, setLocalInvoices] = useState<Invoice[]>([]);

  // Actualizar localInvoices cuando invoices cambie
  useEffect(() => {
    setLocalInvoices(invoices);
  }, [invoices]);

  // Función para marcar una factura como pagada
  const markInvoiceAsPaid = async (invoiceId: string) => {
    try {
      await updateDoc(doc(db, "invoices", invoiceId), {
        isPaid: true,
        status: "completed",
      });
      toast({ title: "Factura marcada como pagada" });

      // Actualizar el estado local de las facturas
      setLocalInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.id === invoiceId ? { ...invoice, isPaid: true, status: "completed" } : invoice
        )
      );
    } catch (error) {
      toast({ title: "Error al marcar la factura como pagada", variant: "destructive" });
    }
  };

  // Función para abrir el modal de edición de factura
  const openEditInvoiceModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditInvoiceModalOpen(true);
  };

  // Función para actualizar la lista de facturas después de editar
  const handleInvoiceUpdated = (updatedInvoice: Invoice) => {
    setLocalInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      )
    );
  };

  if (clientsLoading || eventsLoading || productsLoading || invoicesLoading) {
    return <div>Cargando...</div>;
  }

  if (clientsError || eventsError || productsError || invoicesError) {
    return <div>Error al cargar los datos</div>;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        <div className="p-6">
          {/* Sección del Dashboard */}
          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Panel Principal</h2>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen General</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Clientes registrados: {clients.length}</p>
                    <p>Productos en inventario: {products.length}</p>
                    <p>Eventos programados: {events.length}</p>
                    <p>Facturas generadas: {invoices.length}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Sección de Clientes */}
          {activeTab === "clients" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Clientes</h2>
                <Button onClick={() => setIsNewClientModalOpen(true)} className="bg-red-500 hover:bg-red-600">
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
                </Button>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {clients.map((client) => (
                  <Card key={client.id}>
                    <CardHeader>
                      <CardTitle>{client.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Edad: {client.age}</p>
                      <p>Teléfono: {client.phone}</p>
                      <p>Dirección: {client.address}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Sección de Productos */}
          {activeTab === "products" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Productos</h2>
                <Button onClick={() => setIsNewProductModalOpen(true)} className="bg-red-500 hover:bg-red-600">
                  <Plus className="mr-2 h-4 w-4" /> Agregar Producto
                </Button>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <CardTitle>{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Cantidad: {product.quantity}</p>
                      <p>Precio: ${product.price}</p>
                      <p>Descripción: {product.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Sección de Eventos */}
          {activeTab === "events" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Eventos</h2>
                <Button onClick={() => setIsNewEventModalOpen(true)} className="bg-red-500 hover:bg-red-600">
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Evento
                </Button>
              </div>
              <div className="grid gap-4">
                {events.map((event) => (
                  <SortableEvent key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* Sección de Ventas */}
          {activeTab === "sales" && (
  <div>
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-800">Ventas</h2>
      <Button onClick={() => setIsNewInvoiceModalOpen(true)} className="bg-red-500 hover:bg-red-600">
        <Plus className="mr-2 h-4 w-4" /> Nueva Factura
      </Button>
    </div>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {localInvoices.map((invoice) => (
        <Card key={invoice.id}>
          <CardHeader>
            <CardTitle>Factura</CardTitle> {/* Eliminamos el código de la factura */}
          </CardHeader>
          <CardContent>
            <p>Cliente: {invoice.clientName}</p>
            <p>Total: ${invoice.total}</p>
            <p>Estado: {invoice.isPaid ? "Pagada" : "Pendiente"}</p>

            {/* Detalle de productos */}
            <div className="mt-4">
              <Label>Productos consumidos:</Label>
              <ul className="space-y-2">
                {invoice.items.map((item, index) => (
                  <li key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity} x {item.name}
                    </span>
                    <span>${item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tiempo de juego */}
            {invoice.playTime && (
              <div className="mt-4">
                <Label>Tiempo de juego:</Label>
                <p className="text-sm">
                  {invoice.playTime.hours} horas y {invoice.playTime.minutes} minutos
                </p>
              </div>
            )}

            {/* Botones de editar y marcar como pagada */}
            {!invoice.isPaid && (
              <div className="flex gap-2 mt-4">
                <Button onClick={() => openEditInvoiceModal(invoice)}>Editar</Button>
                <Button onClick={() => markInvoiceAsPaid(invoice.id)}>Marcar como Pagada</Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)}
        </div>
      </main>

      {/* Modales */}
      <NewClientModal
  isOpen={isNewClientModalOpen}
  onClose={() => setIsNewClientModalOpen(false)}
  onClientAdded={() => location.reload()} // Recargar la página para ver los cambios
/>
<NewEventModal
  isOpen={isNewEventModalOpen}
  onClose={() => setIsNewEventModalOpen(false)}
  clients={clients}
  onEventCreated={() => location.reload()} // Recargar la página para ver los cambios
/>
<NewProductModal
  isOpen={isNewProductModalOpen}
  onClose={() => setIsNewProductModalOpen(false)}
  onProductAdded={() => location.reload()} // Recargar la página para ver los cambios
/>
      <NewInvoiceModal
        isOpen={isNewInvoiceModalOpen}
        onClose={() => setIsNewInvoiceModalOpen(false)}
        clients={clients}
        products={products}
        onInvoiceCreated={() => setLocalInvoices([...localInvoices])}
      />
      {selectedInvoice && (
        <EditInvoiceModal
          isOpen={isEditInvoiceModalOpen}
          onClose={() => setIsEditInvoiceModalOpen(false)}
          invoice={selectedInvoice}
          products={products}
          onInvoiceUpdated={handleInvoiceUpdated}
        />
      )}
    </div>
  );
};

export default Dashboard;