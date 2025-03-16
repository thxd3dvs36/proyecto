"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Event } from "@/types/types";

interface SortableEventProps {
  event: Event;
}

export const SortableEvent: React.FC<SortableEventProps> = ({ event }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: event.id });

  const formatEventCountdown = (date: string, time: string): string => {
    const eventDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (eventDateTime < now) {
      return "Past event";
    }

    const diffTime = eventDateTime.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today!";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else {
      return `${diffDays} days`;
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="relative overflow-hidden">
        <div className={`absolute right-0 top-0 h-full w-1.5 ${event.type === "birthday" ? "bg-pink-500" : "bg-blue-500"}`} />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge className={event.type === "birthday" ? "bg-pink-100 text-pink-800" : "bg-blue-100 text-blue-800"}>
              {event.type === "birthday" ? "Birthday" : "Private"}
            </Badge>
            <div className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
              {formatEventCountdown(event.date, event.time)}
            </div>
          </div>
          <h3 className="text-lg font-semibold">{event.name}</h3>
          <p className="text-sm text-slate-500">
            {event.date} at {event.time}
          </p>
        </CardHeader>
        <CardContent className="pb-2 pt-0">
          {event.hostClientId && (
            <div className="mb-2 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
                  {event.hostClientName?.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{event.hostClientName}</span>
            </div>
          )}
          <div className="mb-1 text-xs text-slate-500">
            Capacity: {event.confirmed}/{event.capacity} confirmed
          </div>
          <Progress value={(event.confirmed / event.capacity) * 100} className="h-2" />
          {event.specialRequirements && (
            <div className="mt-2 text-xs text-slate-500">
              <span className="font-medium">Special requirements:</span> {event.specialRequirements}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};