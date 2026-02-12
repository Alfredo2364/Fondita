import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/menu_models.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  Stream<List<Category>> getCategories() {
    return _db
        .collection('categories')
        .orderBy('createdAt', descending: false)
        .snapshots()
        .map((snapshot) {
          return snapshot.docs
              .map((doc) => Category.fromMap(doc.data(), doc.id))
              .toList();
        });
  }

  Stream<List<Dish>> getDishes() {
    return _db.collection('menu_items').snapshots().map((snapshot) {
      return snapshot.docs
          .map((doc) => Dish.fromMap(doc.data(), doc.id))
          .toList();
    });
  }

  Future<void> placeOrder(Map<String, dynamic> orderData) async {
    final orderRef = await _db.collection('orders').add({
      ...orderData,
      'createdAt': FieldValue.serverTimestamp(),
      'status': 'pending',
    });

    // Optional: Update table status if tableId is provided
    if (orderData['tableId'] != null) {
      await _db.collection('tables').doc(orderData['tableId']).update({
        'status': 'occupied',
        'currentOrderId': orderRef.id,
      });
    }
  }

  Future<void> closeTable({
    required String tableId,
    required String orderId,
    required String paymentMethod,
    required double total,
    required List<Map<String, dynamic>> items,
    required String employeeId,
    required String restaurantId,
  }) async {
    // 4. Update Inventory (Deduct Stock)
    // Need to fetch dish details to get recipes. ideally this should be done serverside or with a more robust query
    // For now, we assume 'items' contains necessary data or we fetch it.
    // Optimization: 'items' in order already has 'dishId'. We need to fetch the Dish doc to get the recipe.

    // NOTE: In a real app, this should be a Cloud Function to avoid client-side complexity and security issues.
    // For this prototype, we will try to do it here, but it's complex inside a batch/transaction without reading first.
    // CORRECT APPROACH for Client SDK: Read needed data, then Run Transaction.

    final orderRef = _db.collection('orders').doc(orderId);
    final tableRef = _db.collection('tables').doc(tableId);
    final saleRef = _db.collection('sales').doc();

    await _db.runTransaction((transaction) async {
      // Reads
      final orderDoc = await transaction.get(orderRef);
      final tableDoc = await transaction.get(tableRef);

      if (!orderDoc.exists || !tableDoc.exists)
        throw Exception("Order or Table not found");

      // Logic to deduct stock
      for (var item in items) {
        final dishId = item['dishId'];
        final quantity = item['quantity'] as int;

        // Read Dish to get Recipe
        final dishSnapshot = await transaction.get(
          _db.collection('menu_items').doc(dishId),
        );
        if (!dishSnapshot.exists) continue;

        final dishData = dishSnapshot.data()!;
        final recipe = (dishData['recipe'] as List<dynamic>?);

        if (recipe != null) {
          for (var ingredient in recipe) {
            final ingId = ingredient['ingredientId'];
            final qtyPerDish = (ingredient['quantity'] as num).toDouble();
            final totalToDeduct = qtyPerDish * quantity;

            final ingRef = _db.collection('inventory_items').doc(ingId);
            final ingDoc = await transaction.get(ingRef);

            if (ingDoc.exists) {
              final currentStock = (ingDoc.data()!['currentStock'] as num)
                  .toDouble();
              transaction.update(ingRef, {
                'currentStock': currentStock - totalToDeduct,
              });
            }
          }
        }
      }

      // Writes (Sale, Order, Table)
      transaction.set(saleRef, {
        'restaurantId': restaurantId,
        'employeeId': employeeId,
        'tableId': tableId,
        'total': total,
        'paymentMethod': paymentMethod,
        'timestamp': FieldValue.serverTimestamp(),
        'items': items,
      });

      transaction.update(orderRef, {'status': 'paid'});

      transaction.update(tableRef, {
        'status': 'available',
        'currentOrderId': FieldValue.delete(),
      });
    });
  }
}

final firestoreServiceProvider = Provider<FirestoreService>((ref) {
  return FirestoreService();
});

final categoriesProvider = StreamProvider<List<Category>>((ref) {
  return ref.watch(firestoreServiceProvider).getCategories();
});

final dishesProvider = StreamProvider<List<Dish>>((ref) {
  return ref.watch(firestoreServiceProvider).getDishes();
});
