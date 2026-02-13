import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';

export interface CashRegister {
    id?: string;
    restaurantId: string;
    openedBy: string;
    openedByName: string;
    initialFund: number; // Fondo inicial (morralla)
    openedAt: Timestamp | Date;
    closedAt?: Timestamp | Date;
    closedBy?: string;
    closedByName?: string;
    finalAmount?: number;
    status: 'open' | 'closed';
}

export interface CashWithdrawal {
    id?: string;
    restaurantId: string;
    registerId: string;
    amount: number;
    reason: string;
    withdrawnBy: string;
    withdrawnByName: string;
    createdAt: Timestamp | Date;
}

const REGISTERS_COLLECTION = 'cash_registers';
const WITHDRAWALS_COLLECTION = 'cash_withdrawals';

// Abrir caja con fondo inicial
export const openCashRegister = async (register: Omit<CashRegister, 'id' | 'openedAt' | 'status'>) => {
    try {
        const docRef = await addDoc(collection(db, REGISTERS_COLLECTION), {
            ...register,
            openedAt: serverTimestamp(),
            status: 'open'
        });
        return docRef.id;
    } catch (error) {
        console.error('Error opening cash register:', error);
        throw error;
    }
};

// Registrar retiro parcial (arqueo)
export const addCashWithdrawal = async (withdrawal: Omit<CashWithdrawal, 'id' | 'createdAt'>) => {
    try {
        const docRef = await addDoc(collection(db, WITHDRAWALS_COLLECTION), {
            ...withdrawal,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding cash withdrawal:', error);
        throw error;
    }
};

// Obtener caja abierta actual
export const getOpenCashRegister = async (restaurantId: string): Promise<CashRegister | null> => {
    try {
        const q = query(
            collection(db, REGISTERS_COLLECTION),
            where('restaurantId', '==', restaurantId),
            where('status', '==', 'open'),
            orderBy('openedAt', 'desc')
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;

        return {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data()
        } as CashRegister;
    } catch (error) {
        console.error('Error fetching open cash register:', error);
        return null;
    }
};

// Obtener retiros de una caja específica
export const getWithdrawals = async (registerId: string): Promise<CashWithdrawal[]> => {
    try {
        const q = query(
            collection(db, WITHDRAWALS_COLLECTION),
            where('registerId', '==', registerId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as CashWithdrawal));
    } catch (error) {
        console.error('Error fetching withdrawals:', error);
        return [];
    }
};
