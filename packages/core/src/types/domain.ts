// Спільні доменні типи, що використовуються в API, Web і Mobile тестах.
// SOLID (D): усі три шари залежать від цієї абстракції моделі даних,
// а не кожен визначає власну — усуває розсинхрон структур (DRY).

export interface User {
    id: number;
    email: string;
    password: string;
    role: 'admin' | 'customer';
}

export interface OrderItem {
    sku: string;
    qty: number;
}

export interface Order {
    id: string;
    userId: number;
    items: OrderItem[];
    status: 'pending' | 'paid' | 'shipped';
}
