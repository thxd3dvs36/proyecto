"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { db } from "@/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({ isOpen, onClose, onProductAdded }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const saveProduct = async () => {
    if (!name || quantity <= 0 || price <= 0) {
      toast({ title: "Por favor, complete todos los campos correctamente", variant: "destructive" });
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        name,
        quantity,
        price,
        description,
        lowStock: quantity <= 10, // Marcar como bajo stock si la cantidad es menor o igual a 10
        createdAt: serverTimestamp(),
      });
      toast({ title: "Producto agregado correctamente" });
      onClose();
      onProductAdded(); // Actualizar la lista de productos
    } catch (error) {
      toast({ title: "Error al agregar el producto", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Producto</DialogTitle>
          <DialogDescription>Complete los detalles del producto.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Nombre del producto</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Cantidad</Label>
            <Input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          </div>
          <div>
            <Label>Precio</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </div>
          <div>
            <Label>Descripción</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={saveProduct}>Guardar Producto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};