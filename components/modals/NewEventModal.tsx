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

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onEventCreated: () => void;
}

export const NewEventModal: React.FC<NewEventModalProps> = ({ isOpen, onClose, clients, onEventCreated }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"birthday" | "private">("birthday");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hostClientId, setHostClientId] = useState("");
  const [capacity, setCapacity] = useState(15);
  const [specialRequirements, setSpecialRequirements] = useState("");

  const saveEvent = async () => {
    if (!name || !date || !time || capacity <= 0) {
      toast({ title: "Please fill all fields correctly", variant: "destructive" });
      return;
    }

    try {
      await addDoc(collection(db, "events"), {
        name,
        type,
        date,
        time,
        hostClientId,
        capacity,
        confirmed: 0,
        specialRequirements,
        order: 0,
        createdAt: serverTimestamp(),
      });
      toast({ title: "Event created successfully" });
      onClose();
      onEventCreated();
    } catch (error) {
      toast({ title: "Error creating event", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Event</DialogTitle>
          <DialogDescription>Create a new event for your clients.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Event Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Event Type</Label>
            <Select onValueChange={(value: "birthday" | "private") => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="birthday">Birthday</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Time</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div>
            <Label>Host Client</Label>
            <Select onValueChange={setHostClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a host client" />
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
            <Label>Capacity</Label>
            <Input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
          </div>
          <div>
            <Label>Special Requirements</Label>
            <Input value={specialRequirements} onChange={(e) => setSpecialRequirements(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={saveEvent}>Create Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};