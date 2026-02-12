export interface User {
    uid: string;
    name: string;
    email: string;
    role: 'admin' | 'staff' | 'customer';
    createdAt: Date;
    restaurantId?: string;
}

export interface Dish {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl?: string;
    categoryId: string;
    isAvailable: boolean;
    recipe?: { ingredientId: string; quantity: number }[];
}

export interface Restaurant {
    id: string;
    name: string;
    address: string;
    ownerId: string;
    createdAt: Date;
}

export interface Table {
    id: string;
    number: number;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved';
    currentOrderId?: string;
    restaurantId: string;
    x?: number;
    y?: number;
}

export interface InventoryItem {
    id: string;
    restaurantId: string;
    name: string;
    unit: 'kg' | 'lt' | 'unit';
    currentStock: number;
    minStock: number;
    cost: number;
}

export interface SaleDetail {
    menuItemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface Sale {
    id: string;
    restaurantId: string;
    employeeId: string;
    tableId?: string;
    total: number;
    paymentMethod: 'cash' | 'card';
    timestamp: Date;
    items: SaleDetail[];
}

export interface Order {
    id?: string;
    items: {
        dishId: string;
        name: string;
        quantity: number;
        price: number;
    }[];
    total: number;
    tableNumber: string;
    status: 'pending' | 'cooking' | 'ready' | 'delivered';
    createdAt?: any;
    restaurantId?: string;
    paymentMethod: 'cash' | 'card';
}

export interface Category {
    id?: string;
    name: string;
    createdAt?: any;
}
