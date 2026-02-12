import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { Table } from '@/types';

export const getTables = async (restaurantId: string): Promise<Table[]> => {
    const q = query(
        collection(db, 'tables'),
        where('restaurantId', '==', restaurantId),
        orderBy('number', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Table));
};

export const addTable = async (restaurantId: string, number: number, capacity: number) => {
    await addDoc(collection(db, 'tables'), {
        restaurantId,
        number,
        capacity,
        status: 'available',
    });
};

export const deleteTable = async (id: string) => {
    await deleteDoc(doc(db, 'tables', id));
};

export const updateTablePosition = async (id: string, x: number, y: number) => {
    await updateDoc(doc(db, 'tables', id), { x, y });
};
