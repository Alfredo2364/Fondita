import { db } from './firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Sale } from '@/types';

export const getSales = async (restaurantId: string): Promise<Sale[]> => {
    const q = query(
        collection(db, 'sales'),
        where('restaurantId', '==', restaurantId),
        orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp.toDate(), // Convert Firestore Timestamp to JS Date
        } as Sale;
    });
};
