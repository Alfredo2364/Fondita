import { db, storage } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    doc,
    serverTimestamp,
    orderBy,
    onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { Dish, Category, Order } from '@/types';

// Interfaces
// Local interfaces removed in favor of global types from '@/types'

// Categories
export const addCategory = async (name: string) => {
    await addDoc(collection(db, 'categories'), {
        name,
        createdAt: serverTimestamp(),
    });
};

export const getCategories = async (): Promise<Category[]> => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
};

// Dishes
export const addDish = async (dish: Omit<Dish, 'id'>, imageFile?: File) => {
    let imageUrl = '';

    if (imageFile) {
        imageUrl = await uploadImage(imageFile);
    }

    await addDoc(collection(db, 'menu_items'), {
        ...dish,
        imageUrl,
        createdAt: serverTimestamp(),
    });
};

export const getDishes = async (categoryId?: string): Promise<Dish[]> => {
    let q;
    if (categoryId) {
        q = query(collection(db, 'menu_items'), where('categoryId', '==', categoryId));
    } else {
        q = query(collection(db, 'menu_items'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dish));
};

export const updateDishAvailability = async (dishId: string, isAvailable: boolean) => {
    const dishRef = doc(db, 'menu_items', dishId);
    await updateDoc(dishRef, { isAvailable });
};

// Storage
export const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `menu/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};

// Orders
export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        callback(orders);
    });
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
};
