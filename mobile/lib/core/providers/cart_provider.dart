import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/menu_models.dart';

class CartItem {
  final Dish dish;
  final int quantity;

  CartItem({required this.dish, required this.quantity});

  double get total => dish.price * quantity;
}

class CartNotifier extends Notifier<List<CartItem>> {
  @override
  List<CartItem> build() {
    return [];
  }

  void addToCart(Dish dish) {
    state = [...state, CartItem(dish: dish, quantity: 1)];
  }

  void removeFromCart(CartItem item) {
    state = state.where((i) => i != item).toList();
  }

  void clearCart() {
    state = [];
  }

  double get total => state.fold(0, (sum, item) => sum + item.total);
}

final cartProvider = NotifierProvider<CartNotifier, List<CartItem>>(() {
  return CartNotifier();
});
