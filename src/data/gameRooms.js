export const rooms = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    type: index < 4 ? 'basic' : index < 7 ? 'intermediate' : 'immersive',
    price: index < 4 ? 10 : index < 7 ? 15 : 25,
    maxCapacity: 4,
    currentGroup: null,
    orders: [] // Cada orden tendrá: { id, items: [{snackId, quantity, delivered}], timestamp }
}));

export const roomTypes = {
    basic: {
        name: 'Sala Básica',
        price: 10,
        description: 'Juegos simples con mandos clásicos'
    },
    intermediate: {
        name: 'Sala Intermedia',
        price: 15,
        description: 'Juegos con mandos especiales'
    },
    immersive: {
        name: 'Sala Inmersiva',
        price: 25,
        description: 'Juegos de realidad virtual'
    }
};

export const snacks = [
    { id: 1, name: 'Palomitas de Maíz', price: 5, image: '🍿' },
    { id: 2, name: 'Nachos con Queso', price: 7, image: '🧀' },
    { id: 3, name: 'Refresco', price: 3, image: '🥤' },
    { id: 4, name: 'Hot Dog', price: 6, image: '🌭' },
    { id: 5, name: 'Papas Fritas', price: 4, image: '🍟' },
    { id: 6, name: 'Pizza', price: 8, image: '🍕' },
    { id: 7, name: 'Hamburguesa', price: 9, image: '🍔' },
    { id: 8, name: 'Taco', price: 7, image: '🌮' },
    { id: 9, name: 'Sushi', price: 12, image: '🍣' },
    { id: 10, name: 'Helado', price: 4, image: '🍦' },
    { id: 11, name: 'Chocolate', price: 3, image: '🍫' },
    { id: 12, name: 'Galletas', price: 2, image: '🍪' },
    { id: 13, name: 'Caramelos', price: 1, image: '🍬' },
    { id: 14, name: 'Manzana', price: 2, image: '🍎' },
    { id: 15, name: 'Sandía', price: 3, image: '🍉' },
    { id: 16, name: 'Croissant', price: 3, image: '🥐' },
    { id: 17, name: 'Pretzel', price: 4, image: '🥨' },
    { id: 18, name: 'Dona', price: 3, image: '🍩' },
    { id: 19, name: 'Café', price: 2, image: '☕' },
    { id: 20, name: 'Té', price: 2, image: '🍵' }
];

// Sistema de gestión de órdenes
export let pendingOrders = [];
export let completedOrders = [];