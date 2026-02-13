import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';

export interface WasteRecord {
    id?: string;
    restaurantId: string;
    type: 'operational' | 'error'; // operativa o por error
    dishId?: string;
    dishName: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    reason: string;
    registeredBy: string;
    registeredByName: string;
    createdAt: Timestamp | Date;
}

const WASTE_COLLECTION = 'waste';

export const addWaste = async (waste: Omit<WasteRecord, 'id' | 'createdAt'>) => {
    try {
        const docRef = await addDoc(collection(db, WASTE_COLLECTION), {
            ...waste,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding waste:', error);
        throw error;
    }
};

export const getWaste = async (restaurantId: string, startDate?: Date, endDate?: Date): Promise<WasteRecord[]> => {
    try {
        let q = query(
            collection(db, WASTE_COLLECTION),
            where('restaurantId', '==', restaurantId),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as WasteRecord));
    } catch (error) {
        console.error('Error fetching waste:', error);
        return [];
    }
};

export const getWasteSummary = async (restaurantId: string): Promise<{ operational: number; error: number; total: number }> => {
    try {
        const waste = await getWaste(restaurantId);
        const operational = waste.filter(w => w.type === 'operational').reduce((sum, w) => sum + w.totalCost, 0);
        const error = waste.filter(w => w.type === 'error').reduce((sum, w) => sum + w.totalCost, 0);
        return {
            operational,
            error,
            total: operational + error
        };
    } catch (error) {
        console.error('Error calculating waste summary:', error);
        return { operational: 0, error: 0, total: 0 };
    }
};
