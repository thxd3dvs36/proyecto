"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { db } from "@/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import { Product } from "@/types/types";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onProductDeleted: () => void;
}

export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({ isOpen, onClose, product, onProductDeleted }) => {
  const confirmDeleteProduct = async () => {
    try {
      await deleteDoc(doc(db, "products", product.id));
      toast({ title: "Product deleted successfully" });
      onClose();
      onProductDeleted();
    } catch (error) {
      toast({ title: "Error deleting product", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {product.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={confirmDeleteProduct}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};