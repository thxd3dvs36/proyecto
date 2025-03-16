"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { db } from "@/firebaseConfig";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { Product } from "@/types/types";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onProductSaved: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onProductSaved }) => {
  const [name, setName] = useState(product?.name || "");
  const [quantity, setQuantity] = useState(product?.quantity || 0);
  const [price, setPrice] = useState(product?.price || 0);
  const [description, setDescription] = useState(product?.description || "");

  const saveProduct = async () => {
    if (!name || quantity <= 0 || price <= 0) {
      toast({ title: "Please fill all fields correctly", variant: "destructive" });
      return;
    }

    try {
      if (product) {
        await updateDoc(doc(db, "products", product.id), {
          name,
          quantity,
          price,
          description,
        });
        toast({ title: "Product updated successfully" });
      } else {
        await addDoc(collection(db, "products"), {
          name,
          quantity,
          price,
          description,
          lowStock: quantity <= 10,
        });
        toast({ title: "Product added successfully" });
      }
      onClose();
      onProductSaved();
    } catch (error) {
      toast({ title: "Error saving product", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "New Product"}</DialogTitle>
          <DialogDescription>{product ? "Edit the product details." : "Add a new product to the inventory."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Quantity</Label>
            <Input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          </div>
          <div>
            <Label>Price</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={saveProduct}>{product ? "Save Changes" : "Add Product"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};