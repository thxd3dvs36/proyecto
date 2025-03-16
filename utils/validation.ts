export const validateClient = (client: {
    name: string;
    age: number;
    birthdate: string;
    parents: string;
    address: string;
    phone: string;
    emergencyContact: string;
  }) => {
    if (!client.name || client.name.trim() === "") {
      return "Name is required";
    }
    if (client.age <= 0) {
      return "Age must be greater than 0";
    }
    if (!client.birthdate) {
      return "Birthdate is required";
    }
    if (!client.phone || client.phone.trim() === "") {
      return "Phone is required";
    }
    return null;
  };
  
  export const validateProduct = (product: {
    name: string;
    quantity: number;
    price: number;
  }) => {
    if (!product.name || product.name.trim() === "") {
      return "Name is required";
    }
    if (product.quantity <= 0) {
      return "Quantity must be greater than 0";
    }
    if (product.price <= 0) {
      return "Price must be greater than 0";
    }
    return null;
  };
  
  export const validateInvoice = (invoice: {
    clientId: string;
    discount: number;
    playTime: { hours: number; minutes: number };
  }) => {
    if (!invoice.clientId) {
      return "Client is required";
    }
    if (invoice.discount < 0 || invoice.discount > 100) {
      return "Discount must be between 0 and 100";
    }
    if (invoice.playTime.hours < 0 || invoice.playTime.minutes < 0) {
      return "Play time must be positive";
    }
    return null;
  };