import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { InventoryItem } from '@/types';

export const getInventory = async (restaurantId: string): Promise<InventoryItem[]> => {
    const q = query(collection(db, 'inventory_items'), where('restaurantId', '==', restaurantId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as InventoryItem));
};

export const addInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
    await addDoc(collection(db, 'inventory_items'), item);
};

export const updateStock = async (id: string, newStock: number) => {
    await updateDoc(doc(db, 'inventory_items', id), {
        currentStock: newStock,
    });
};
