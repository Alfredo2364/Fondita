import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../core/services/firestore_service.dart';
import '../../core/providers/cart_provider.dart';
import '../cart/cart_screen.dart';

class HomeScreen extends ConsumerWidget {
  final String? tableId;
  final int? tableNumber;

  const HomeScreen({super.key, this.tableId, this.tableNumber});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final categoriesAsync = ref.watch(categoriesProvider);
    final dishesAsync = ref.watch(dishesProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(tableNumber != null ? 'Mesa $tableNumber - Menú' : 'Menú'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => FirebaseAuth.instance.signOut(),
          ),
        ],
      ),
      body: categoriesAsync.when(
        data: (categories) => dishesAsync.when(
          data: (dishes) {
            if (categories.isEmpty) {
              return const Center(child: Text('No hay menú disponible.'));
            }
            return DefaultTabController(
              length: categories.length,
              child: Column(
                children: [
                  TabBar(
                    isScrollable: true,
                    tabs: categories.map((c) => Tab(text: c.name)).toList(),
                  ),
                  Expanded(
                    child: TabBarView(
                      children: categories.map((category) {
                        final categoryDishes = dishes
                            .filter((d) => d.categoryId == category.id)
                            .toList();
                        if (categoryDishes.isEmpty) {
                          return const Center(
                            child: Text('No hay platillos en esta categoría.'),
                          );
                        }
                        return ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: categoryDishes.length,
                          itemBuilder: (context, index) {
                            final dish = categoryDishes[index];
                            return Card(
                              margin: const EdgeInsets.only(bottom: 16),
                              child: ListTile(
                                leading:
                                    dish.imageUrl != null &&
                                        dish.imageUrl!.isNotEmpty
                                    ? Image.network(
                                        dish.imageUrl!,
                                        width: 50,
                                        height: 50,
                                        fit: BoxFit.cover,
                                        errorBuilder: (c, e, s) =>
                                            const Icon(Icons.broken_image),
                                      )
                                    : const Icon(Icons.fastfood, size: 50),
                                title: Text(dish.name),
                                subtitle: Text(dish.description),
                                trailing: IconButton(
                                  icon: const Icon(
                                    Icons.add_shopping_cart,
                                    color: Colors.deepOrange,
                                  ),
                                  onPressed: () {
                                    ref
                                        .read(cartProvider.notifier)
                                        .addToCart(dish);
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text('${dish.name} agregado'),
                                        duration: const Duration(
                                          milliseconds: 500,
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),
                            );
                          },
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, s) => Center(child: Text('Error cargando platillos: $e')),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, s) => Center(child: Text('Error cargando categorías: $e')),
      ),
      floatingActionButton: Consumer(
        builder: (context, ref, child) {
          final cartItems = ref.watch(cartProvider);
          if (cartItems.isEmpty) return const SizedBox.shrink();
          return FloatingActionButton.extended(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) =>
                      CartScreen(tableId: tableId, tableNumber: tableNumber),
                ),
              );
            },
            label: Text('Ver Pedido (${cartItems.length})'),
            icon: const Icon(Icons.shopping_cart),
          );
        },
      ),
    );
  }
}

extension IterableExtension<E> on Iterable<E> {
  Iterable<E> filter(bool Function(E) test) => where(test);
}
