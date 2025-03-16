"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { Product, Invoice } from "@/types/types";

interface EditInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  products: Product[];
  onInvoiceUpdated: (updatedInvoice: Invoice) => void;
}

export const EditInvoiceModal: React.FC<EditInvoiceModalProps> = ({ isOpen, onClose, invoice, products, onInvoiceUpdated }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [invoiceItems, setInvoiceItems] = useState<Array<{ productId: string; name: string; quantity: number; price: number }>>(
    invoice.items || []
  );
  const [playTime, setPlayTime] = useState(invoice.playTime || { hours: 0, minutes: 0, rate: 8.99 });

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
    setSelectedProduct(null);
    setQuantity(1);
  };

  // Guardar la factura actualizada
  const saveInvoice = async () => {
    try {
      const updatedInvoice = {
        ...invoice,
        items: invoiceItems,
        playTime: playTime,
        total: calculateTotal(invoiceItems, playTime, invoice.discount),
      };

      await updateDoc(doc(db, "invoices", invoice.id), updatedInvoice);
      toast({ title: "Factura actualizada correctamente" });

      // Llamar a onInvoiceUpdated con la factura actualizada
      onInvoiceUpdated(updatedInvoice);

      onClose(); // Cerrar el modal
    } catch (error) {
      toast({ title: "Error al actualizar la factura", variant: "destructive" });
    }
  };

  // Calcular el total de la factura
  const calculateTotal = (items: any[], playTime: { hours: number; minutes: number; rate: number }, discount: number) => {
    const itemsTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const playTimeTotal = (playTime.hours + playTime.minutes / 60) * playTime.rate;
    const subtotal = itemsTotal + playTimeTotal;
    return subtotal * (1 - discount / 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Factura</DialogTitle>
          <DialogDescription>Agregue más productos y tiempo de juego a la factura.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
            <div className="space-y-2">
              {invoiceItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>{item.quantity} x ${item.price}</span>
                </div>
              ))}
            </div>
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
        </div>
        <DialogFooter>
          <Button onClick={saveInvoice}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};