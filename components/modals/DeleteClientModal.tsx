"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { db } from "@/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import { Client } from "@/types/types";

interface DeleteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onClientDeleted: () => void;
}

export const DeleteClientModal: React.FC<DeleteClientModalProps> = ({ isOpen, onClose, client, onClientDeleted }) => {
  const confirmDeleteClient = async () => {
    try {
      await deleteDoc(doc(db, "clients", client.id));
      toast({ title: "Client deleted successfully" });
      onClose();
      onClientDeleted();
    } catch (error) {
      toast({ title: "Error deleting client", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Client</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {client.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={confirmDeleteClient}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};