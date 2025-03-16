"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { db } from "@/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: () => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose, onClientAdded }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [birthdate, setBirthdate] = useState("");
  const [parents, setParents] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  const saveNewClient = async () => {
    if (!name || !age || !birthdate || !parents || !address || !phone || !emergencyContact) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    try {
      await addDoc(collection(db, "clients"), {
        name,
        age,
        birthdate,
        parents,
        address,
        phone,
        emergencyContact,
        avatar: "/placeholder.svg",
        lastVisit: new Date().toISOString(),
        totalHours: 0,
        todayHours: 0,
        visits: [],
        createdAt: serverTimestamp(),
      });
      toast({ title: "Client added successfully" });
      onClose();
      onClientAdded();
    } catch (error) {
      toast({ title: "Error adding client", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Client</DialogTitle>
          <DialogDescription>Add a new client to the system.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Age</Label>
            <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
          </div>
          <div>
            <Label>Birthdate</Label>
            <Input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
          </div>
          <div>
            <Label>Parents</Label>
            <Input value={parents} onChange={(e) => setParents(e.target.value)} />
          </div>
          <div>
            <Label>Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <Label>Emergency Contact</Label>
            <Input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={saveNewClient}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};