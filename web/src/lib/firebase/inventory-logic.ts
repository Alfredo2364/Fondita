import { db } from './firebase';
import { runTransaction, doc, collection, getDoc } from 'firebase/firestore';
import { Dish, InventoryItem } from '@/types';

/**
 * Decrements inventory stock based on the sold dishes and their recipes.
 * Uses a Firestore transaction to ensure atomic updates.
 * 
 * @param soldItems Array of items sold, each containing the dish and quantity.
 */
export const processSaleInventory = async (soldItems: { dish: Dish; quantity: number }[]) => {
    if (!soldItems || soldItems.length === 0) return;

    try {
        await runTransaction(db, async (transaction) => {
            // 1. Gather all necessary unique ingredient IDs
            const ingredientUpdates: Map<string, number> = new Map(); // Map<IngredientID, QuantityToDeduct>

            for (const item of soldItems) {
                if (!item.dish.recipe || item.dish.recipe.length === 0) continue;

                for (const ingredient of item.dish.recipe) {
                    const currentDeduction = ingredientUpdates.get(ingredient.ingredientId) || 0;
                    ingredientUpdates.set(
                        ingredient.ingredientId,
                        currentDeduction + (ingredient.quantity * item.quantity)
                    );
                }
            }

            if (ingredientUpdates.size === 0) return;

            // 2. Read all inventory items (Read must come before Write in transactions)
            const inventoryRefs = Array.from(ingredientUpdates.keys()).map(id => ({
                id,
                ref: doc(db, 'inventory_items', id)
            }));

            const inventorySnapshots = await Promise.all(inventoryRefs.map(item => transaction.get(item.ref)));

            // 3. Process updates
            for (let i = 0; i < inventorySnapshots.length; i++) {
                const snapshot = inventorySnapshots[i];
                const ingredientId = inventoryRefs[i].id;
                const deductionAmount = ingredientUpdates.get(ingredientId)!;

                if (!snapshot.exists()) {
                    console.warn(`Ingredient ${ingredientId} not found in inventory. Skipping.`);
                    continue;
                }

                const currentStock = snapshot.data().currentStock || 0;
                const newStock = currentStock - deductionAmount;

                // Optional: Prevent negative stock or just log it
                // if (newStock < 0) throw new Error(`Insufficient stock for ingredient ${snapshot.data().name}`);

                transaction.update(inventoryRefs[i].ref, {
                    currentStock: newStock
                });
            }
        });

        console.log('Inventory successfully updated for sale.');
    } catch (error) {
        console.error('Error updating inventory:', error);
        // We might not want to block the sale if stock update fails, 
        // but for now we just log the error.
        throw error;
    }
};
