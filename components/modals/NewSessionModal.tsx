"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { db } from "@/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Client } from "@/types/types";

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onSessionCreated: () => void;
}

export const NewSessionModal: React.FC<NewSessionModalProps> = ({ isOpen, onClose, clients, onSessionCreated }) => {
  const [clientId, setClientId] = useState("");
  const [duration, setDuration] = useState(60);

  const startSession = async () => {
    if (!clientId) {
      toast({ title: "Please select a client", variant: "destructive" });
      return;
    }

    try {
      await addDoc(collection(db, "sessions"), {
        clientId,
        duration,
        startTime: serverTimestamp(),
        status: "active",
      });
      toast({ title: "Session started successfully" });
      onClose();
      onSessionCreated();
    } catch (error) {
      toast({ title: "Error starting session", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Session</DialogTitle>
          <DialogDescription>Start a new session for a client.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Client</Label>
            <Select onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
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
          <div>
            <Label>Duration (minutes)</Label>
            <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={startSession}>Start Session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};