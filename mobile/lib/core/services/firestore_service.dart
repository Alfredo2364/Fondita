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
    await _db.collection('orders').add({
      ...orderData,
      'createdAt': FieldValue.serverTimestamp(),
      'status': 'pending',
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
