import { db } from './firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Sale } from '@/types';

export const getSales = async (restaurantId: string): Promise<Sale[]> => {
    // We treat 'orders' as sales since they are created upon payment in POS
    const q = query(
        collection(db, 'orders'),
        where('restaurantId', '==', restaurantId),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            restaurantId: data.restaurantId,
            employeeId: 'unknown', // Order doesn't always have employeeId stored yet
            total: data.total,
            paymentMethod: data.paymentMethod || 'cash',
            timestamp: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            items: (data.items || []).map((item: any) => ({
                menuItemId: item.dishId,
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.price,
                subtotal: item.price * item.quantity
            }))
        } as Sale;
    });
};
