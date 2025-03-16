"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { Client } from "@/types/types";

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onClientUpdated: () => void;
}

export const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onClose, client, onClientUpdated }) => {
  const [name, setName] = useState(client.name);
  const [age, setAge] = useState(client.age);
  const [birthdate, setBirthdate] = useState(client.birthdate);
  const [parents, setParents] = useState(client.parents);
  const [address, setAddress] = useState(client.address);
  const [phone, setPhone] = useState(client.phone);
  const [emergencyContact, setEmergencyContact] = useState(client.emergencyContact);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setAge(client.age);
      setBirthdate(client.birthdate);
      setParents(client.parents);
      setAddress(client.address);
      setPhone(client.phone);
      setEmergencyContact(client.emergencyContact);
    }
  }, [client]);

  const saveEditedClient = async () => {
    if (!name || !age || !birthdate || !parents || !address || !phone || !emergencyContact) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    try {
      await updateDoc(doc(db, "clients", client.id), {
        name,
        age,
        birthdate,
        parents,
        address,
        phone,
        emergencyContact,
      });
      toast({ title: "Client updated successfully" });
      onClose();
      onClientUpdated();
    } catch (error) {
      toast({ title: "Error updating client", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogDescription>Edit the client's information.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Same fields as NewClientModal */}
        </div>
        <DialogFooter>
          <Button onClick={saveEditedClient}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};