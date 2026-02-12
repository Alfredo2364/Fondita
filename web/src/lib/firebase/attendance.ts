import { db } from './firebase';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';

export interface AttendanceRecord {
    id: string;
    userId: string;
    userName: string;
    startTime: Date;
    endTime?: Date;
    date: string; // YYYY-MM-DD
    restaurantId: string;
}

// Helper to get YYYY-MM-DD
const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

export const checkIn = async (userId: string, userName: string, restaurantId: string = 'default_restaurant') => {
    const today = getTodayDateString();

    // Check if already checked in today without checkout
    const q = query(
        collection(db, 'attendance'),
        where('userId', '==', userId),
        where('date', '==', today),
        where('endTime', '==', null)
    );
    const existingSnap = await getDocs(q);

    if (!existingSnap.empty) {
        throw new Error('Ya tienes una sesión activa. Debes hacer Check-Out primero.');
    }

    await addDoc(collection(db, 'attendance'), {
        userId,
        userName,
        startTime: serverTimestamp(),
        endTime: null,
        date: today,
        restaurantId
    });
};

export const checkOut = async (userId: string) => {
    const today = getTodayDateString();

    // Find open session
    const q = query(
        collection(db, 'attendance'),
        where('userId', '==', userId),
        where('endTime', '==', null) // Look for any open session, not just today's, to close it
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        throw new Error('No tienes una sesión activa para cerrar.');
    }

    const docRef = snapshot.docs[0].ref;
    await updateDoc(docRef, {
        endTime: serverTimestamp()
    });
};

export const getDailyAttendance = async (date: string = getTodayDateString(), restaurantId: string = 'default_restaurant'): Promise<AttendanceRecord[]> => {
    const q = query(
        collection(db, 'attendance'),
        where('restaurantId', '==', restaurantId),
        where('date', '==', date),
        orderBy('startTime', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            startTime: (data.startTime as Timestamp)?.toDate(),
            endTime: (data.endTime as Timestamp)?.toDate()
        } as AttendanceRecord;
    });
};

export const getUserStatus = async (userId: string): Promise<'active' | 'inactive'> => {
    const q = query(
        collection(db, 'attendance'),
        where('userId', '==', userId),
        where('endTime', '==', null)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? 'inactive' : 'active';
};
