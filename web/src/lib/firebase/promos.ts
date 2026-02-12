import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, Timestamp } from 'firebase/firestore';

export interface Coupon {
    id?: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    value: number;
    active: boolean;
    createdAt?: any;
}

export const addCoupon = async (code: string, description: string, discountType: 'percentage' | 'fixed', value: number) => {
    await addDoc(collection(db, 'coupons'), {
        code: code.toUpperCase(),
        description,
        discountType,
        value,
        active: true,
        createdAt: Timestamp.now(),
    });
};

export const getCoupons = async (): Promise<Coupon[]> => {
    const q = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon));
};

export const deleteCoupon = async (id: string) => {
    await deleteDoc(doc(db, 'coupons', id));
};

export const validateCoupon = async (code: string): Promise<Coupon | null> => {
    const q = query(collection(db, 'coupons'), where('code', '==', code.toUpperCase()), where('active', '==', true));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Coupon;
};
