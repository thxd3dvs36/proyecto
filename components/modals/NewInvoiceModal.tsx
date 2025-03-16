"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Asegúrate de importar Label
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { db } from "@/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Client, Product } from "@/types/types";

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  products: Product[];
  onInvoiceCreated: () => void;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({ isOpen, onClose, clients, products, onInvoiceCreated }) => {
  const [clientId, setClientId] = useState("");
  const [discount, setDiscount] = useState(0);
  const [playTime, setPlayTime] = useState({ hours: 0, minutes: 0, rate: 8.99 });
  const [notes, setNotes] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<Array<{ productId: string; name: string; quantity: number; price: number }>>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Agregar un producto a la factura
  const addProductToInvoice = () => {
    if (!selectedProduct || quantity <= 0) {
      toast({ title: "Seleccione un producto y una cantidad válida", variant: "destructive" });
      return;
    }

    const newItem = {
      productId: selectedProduct.id,
      name: selectedProduct.name,
      quantity: quantity,
      price: selectedProduct.price,
    };

    setInvoiceItems([...invoiceItems, newItem]);
    setSelectedProduct(null); // Reiniciar el producto seleccionado
    setQuantity(1); // Reiniciar la cantidad
  };

  // Calcular el total de la factura
  const calculateTotal = () => {
    const itemsTotal = invoiceItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const playTimeTotal = (playTime.hours + playTime.minutes / 60) * playTime.rate;
    const subtotal = itemsTotal + playTimeTotal;
    return subtotal * (1 - discount / 100);
  };

  // Guardar la factura
  const saveInvoice = async () => {
    if (!clientId) {
      toast({ title: "Seleccione un cliente", variant: "destructive" });
      return;
    }

    try {
      await addDoc(collection(db, "invoices"), {
        clientId,
        clientName: clients.find((client) => client.id === clientId)?.name || "",
        status: "pending",
        total: calculateTotal(),
        createdAt: serverTimestamp(),
        items: invoiceItems,
        playTime,
        discount,
        notes,
        isPaid: false,
      });
      toast({ title: "Factura creada correctamente" });
      onClose();
      onInvoiceCreated();
    } catch (error) {
      toast({ title: "Error al crear la factura", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nueva Factura</DialogTitle>
          <DialogDescription>Complete los detalles de la factura.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Selección de cliente */}
          <div>
            <Label>Cliente</Label>
            <Select onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Agregar productos */}
          <div>
            <Label>Agregar Producto</Label>
            <div className="flex gap-2">
              <Select onValueChange={(value) => setSelectedProduct(products.find((p) => p.id === value) || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (${product.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Cantidad"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
              />
              <Button onClick={addProductToInvoice}>Agregar</Button>
            </div>
          </div>

          {/* Lista de productos agregados */}
          <div>
            <Label>Productos en la factura</Label>
            <ul className="space-y-2">
              {invoiceItems.map((item, index) => (
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
          <div>
            <Label>Tiempo de Juego</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Horas"
                type="number"
                value={playTime.hours}
                onChange={(e) => setPlayTime({ ...playTime, hours: Number(e.target.value) })}
              />
              <Input
                placeholder="Minutos"
                type="number"
                value={playTime.minutes}
                onChange={(e) => setPlayTime({ ...playTime, minutes: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Descuento y notas */}
          <div>
            <Label>Descuento (%)</Label>
            <Input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              min={0}
              max={100}
            />
          </div>
          <div>
            <Label>Notas</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={saveInvoice}>Guardar Factura</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};