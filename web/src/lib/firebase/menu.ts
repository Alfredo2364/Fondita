import { db, storage } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Dish } from '@/types';

export const getDishes = async (restaurantId: string): Promise<Dish[]> => {
    const q = query(collection(db, 'menu_items'), where('restaurantId', '==', restaurantId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Dish));
};

export const addDish = async (dish: Omit<Dish, 'id'> & { restaurantId: string }) => {
    await addDoc(collection(db, 'menu_items'), dish);
};

export const updateDish = async (id: string, updates: Partial<Dish>) => {
    await updateDoc(doc(db, 'menu_items', id), updates);
};

export const deleteDish = async (id: string) => {
    await deleteDoc(doc(db, 'menu_items', id));
};

export const uploadImage = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};
