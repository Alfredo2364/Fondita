import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/cart_provider.dart';
import '../../core/services/firestore_service.dart';

class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cartItems = ref.watch(cartProvider);
    final cartNotifier = ref.read(cartProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: const Text('Mi Pedido')),
      body: cartItems.isEmpty
          ? const Center(child: Text('El carrito está vacío.'))
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    itemCount: cartItems.length,
                    itemBuilder: (context, index) {
                      final item = cartItems[index];
                      return ListTile(
                        leading: const Icon(Icons.fastfood),
                        title: Text(item.dish.name),
                        subtitle: Text(
                          '\$${item.dish.price.toStringAsFixed(2)} x ${item.quantity}',
                        ),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () => cartNotifier.removeFromCart(item),
                        ),
                      );
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Total:',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            '\$${cartNotifier.total.toStringAsFixed(2)}',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: FilledButton(
                          onPressed: () async {
                            try {
                              final orderData = {
                                'total': cartNotifier.total,
                                'items': cartItems
                                    .map(
                                      (i) => {
                                        'dishId': i.dish.id,
                                        'name': i.dish.name,
                                        'quantity': i.quantity,
                                        'price': i.dish.price,
                                      },
                                    )
                                    .toList(),
                                'tableNumber': '1', // Placeholder or ask user
                              };

                              await ref
                                  .read(firestoreServiceProvider)
                                  .placeOrder(orderData);

                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Pedido enviado a cocina'),
                                ),
                              );
                              cartNotifier.clearCart();
                              if (context.mounted) Navigator.pop(context);
                            } catch (e) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Error al pedir: $e')),
                              );
                            }
                          },
                          child: const Text('Confirmar Pedido'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }
}
