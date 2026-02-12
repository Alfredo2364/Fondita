import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../core/models/table_model.dart';
import '../../core/services/firestore_service.dart';
import '../../features/home/home_screen.dart'; // For adding items

class TableDetailScreen extends ConsumerStatefulWidget {
  final TableModel table;
  const TableDetailScreen({super.key, required this.table});

  @override
  ConsumerState<TableDetailScreen> createState() => _TableDetailScreenState();
}

class _TableDetailScreenState extends ConsumerState<TableDetailScreen> {
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Mesa ${widget.table.number}'),
        backgroundColor: widget.table.status == 'occupied'
            ? Colors.redAccent
            : Colors.green,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Table Info
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    Icon(
                      Icons.table_restaurant,
                      size: 40,
                      color: widget.table.status == 'occupied'
                          ? Colors.red
                          : Colors.green,
                    ),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Estado: ${widget.table.status == 'occupied' ? 'Ocupada' : 'Disponible'}',
                          style: const TextStyle(fontSize: 18),
                        ),
                        Text('Capacidad: ${widget.table.capacity} personas'),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Order Details (if occupied)
            if (widget.table.status == 'occupied' &&
                widget.table.currentOrderId != null)
              Expanded(
                child: StreamBuilder<DocumentSnapshot>(
                  stream: FirebaseFirestore.instance
                      .collection('orders')
                      .doc(widget.table.currentOrderId)
                      .snapshots(),
                  builder: (context, snapshot) {
                    if (!snapshot.hasData)
                      return const CircularProgressIndicator();
                    final order =
                        snapshot.data!.data() as Map<String, dynamic>?;

                    if (order == null)
                      return const Text('Error al cargar orden');

                    final items = (order['items'] as List<dynamic>?) ?? [];
                    final total = (order['total'] ?? 0).toDouble();

                    return Column(
                      children: [
                        const Text(
                          'Orden Actual',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Expanded(
                          child: ListView.builder(
                            itemCount: items.length,
                            itemBuilder: (context, index) {
                              final item = items[index];
                              return ListTile(
                                title: Text(item['name']),
                                subtitle: Text('x${item['quantity']}'),
                                trailing: Text(
                                  '\$${(item['price'] * item['quantity']).toStringAsFixed(2)}',
                                ),
                              );
                            },
                          ),
                        ),
                        const Divider(),
                        Text(
                          'Total: \$${total.toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.green,
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Actions
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton.icon(
                                icon: const Icon(Icons.add),
                                label: const Text('Agregar Productos'),
                                onPressed: () {
                                  // Navigate to Menu with table context
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => HomeScreen(
                                        tableId: widget.table.id,
                                        tableNumber: widget.table.number,
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: FilledButton.icon(
                                icon: _isLoading
                                    ? const SizedBox(
                                        width: 20,
                                        height: 20,
                                        child: CircularProgressIndicator(
                                          color: Colors.white,
                                          strokeWidth: 2,
                                        ),
                                      )
                                    : const Icon(Icons.attach_money),
                                label: const Text('COBRAR (Cerrar)'),
                                style: FilledButton.styleFrom(
                                  backgroundColor: Colors.green,
                                ),
                                onPressed: _isLoading
                                    ? null
                                    : () => _handleCloseTable(total, items),
                              ),
                            ),
                          ],
                        ),
                      ],
                    );
                  },
                ),
              )
            else
              Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Mesa Disponible',
                      style: TextStyle(fontSize: 20, color: Colors.grey),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () {
                        // Open Menu to start new order
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => HomeScreen(
                              tableId: widget.table.id,
                              tableNumber: widget.table.number,
                            ),
                          ),
                        );
                      },
                      child: const Text('Abrir Mesa (Nuevo Pedido)'),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Future<void> _handleCloseTable(double total, List<dynamic> items) async {
    setState(() => _isLoading = true);
    try {
      // Hardcoded employee/restaurant for now
      // In real app, get from Auth Provider
      await ref
          .read(firestoreServiceProvider)
          .closeTable(
            tableId: widget.table.id,
            orderId: widget.table.currentOrderId!,
            paymentMethod: 'cash',
            total: total,
            items: items.cast<Map<String, dynamic>>(),
            employeeId: 'employee_123', // TODO: Get actual user ID
            restaurantId: 'default_restaurant',
          );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Venta Registrada. Mesa Liberada.')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted)
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }
}
