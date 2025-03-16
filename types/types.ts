import { FieldValue } from "firebase/firestore";

export interface Client {
  id: string;
  name: string;
  age: number;
  birthdate: string;
  parents: string;
  address: string;
  phone: string;
  emergencyContact: string;
  avatar: string;
  lastVisit: string;
  totalHours: number;
  todayHours: number;
  visits: Array<{ date: string; duration: string; activity: string }>;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  description: string;
  lowStock: boolean;
}

export interface InvoiceItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Invoice {
    id: string;
    clientId: string;
    clientName: string;
    status: "pending" | "completed"; // "pending" para facturas abiertas, "completed" para pagadas
    total: number;
    createdAt: string | FieldValue;
    items: Array<{ productId: string; name: string; quantity: number; price: number }>;
    playTime: { hours: number; minutes: number; rate: number };
    discount: number;
    notes: string;
    isPaid: boolean; // Nuevo campo para indicar si la factura está pagada
  }

export interface Event {
  id: string;
  name: string;
  type: "birthday" | "private";
  date: string;
  time: string;
  hostClientId?: string;
  hostClientName?: string;
  capacity: number;
  confirmed: number;
  specialRequirements: string;
  order: number;
}

export interface ActiveSession {
  id: string;
  clientId: string;
  clientName: string;
  avatar: string;
  startTime: string;
  duration: number;
  emergency: string;
  status: "active" | "ending-soon" | "expired";
}