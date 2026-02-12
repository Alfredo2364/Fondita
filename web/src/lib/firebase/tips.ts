import { db } from './firebase';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';

export interface TipRecord {
    id: string;
    employeeId: string; // 'pool' or specific user unique id
    employeeName: string;
    amount: number;
    source: 'cash' | 'card' | 'transfer';
    date: Date;
    notes?: string;
}

export const addTip = async (
    employeeId: string,
    employeeName: string,
    amount: number,
    source: 'cash' | 'card' | 'transfer',
    notes?: string
) => {
    await addDoc(collection(db, 'tips'), {
        employeeId,
        employeeName,
        amount,
        source,
        notes,
        createdAt: serverTimestamp(),
    });
};

export const getTips = async (startDate?: Date, endDate?: Date): Promise<TipRecord[]> => {
    // Basic query for now, can be filtered by date range later
    const q = query(
        collection(db, 'tips'),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: (data.createdAt as Timestamp)?.toDate() || new Date(),
        } as TipRecord;
    });
};

export const deleteTip = async (tipId: string) => {
    // TODO: Implement if needed
};
