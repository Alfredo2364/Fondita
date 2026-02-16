import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../core/theme/app_theme.dart';

class KitchenDisplayScreen extends StatefulWidget {
  const KitchenDisplayScreen({Key? key}) : super(key: key);

  @override
  State<KitchenDisplayScreen> createState() => _KitchenDisplayScreenState();
}

class _KitchenDisplayScreenState extends State<KitchenDisplayScreen> {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final String restaurantId = 'default_restaurant';
  String _selectedStatus = 'pending';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cocina'),
        backgroundColor: AppColors.kitchen,
      ),
      body: Column(
        children: [
          _buildStatusTabs(),
          Expanded(child: _buildOrdersList()),
        ],
      ),
    );
  }

  Widget _buildStatusTabs() {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          _buildStatusTab('Pendiente', 'pending', AppColors.warning),
          const SizedBox(width: 8),
          _buildStatusTab('Cocinando', 'cooking', AppColors.info),
          const SizedBox(width: 8),
          _buildStatusTab('Listo', 'ready', AppColors.success),
        ],
      ),
    );
  }

  Widget _buildStatusTab(String label, String status, Color color) {
    final isSelected = _selectedStatus == status;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedStatus = status),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? color : Colors.grey[200],
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: isSelected ? Colors.white : Colors.black,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildOrdersList() {
    return StreamBuilder<QuerySnapshot>(
      stream: _firestore
          .collection('orders')
          .where('restaurantId', isEqualTo: restaurantId)
          .where('status', isEqualTo: _selectedStatus)
          .orderBy('createdAt', descending: false)
          .snapshots(),
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        }

        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        final orders = snapshot.data?.docs ?? [];

        if (orders.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.check_circle_outline,
                  size: 80,
                  color: Colors.grey[300],
                ),
                const SizedBox(height: 16),
                Text(
                  'No hay órdenes $_selectedStatus',
                  style: TextStyle(fontSize: 18, color: Colors.grey[600]),
                ),
              ],
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: orders.length,
          itemBuilder: (context, index) {
            final order = orders[index].data() as Map<String, dynamic>;
            final orderId = orders[index].id;
            final items = (order['items'] as List<dynamic>?) ?? [];
            final tableNumber = order['tableNumber'] ?? 'Para Llevar';
            final createdAt = (order['createdAt'] as Timestamp?)?.toDate();

            return Card(
              margin: const EdgeInsets.only(bottom: 16),
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Icon(
                              tableNumber == 'Para Llevar'
                                  ? Icons.shopping_bag
                                  : Icons.table_restaurant,
                              color: Colors.deepOrange,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              tableNumber.toString(),
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        if (createdAt != null)
                          Text(
                            _formatTime(createdAt),
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[600],
                            ),
                          ),
                      ],
                    ),
                    const Divider(height: 24),
                    ...items.map((item) {
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Row(
                          children: [
                            Container(
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(
                                color: Colors.deepOrange,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Center(
                                child: Text(
                                  '${item['quantity']}',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                item['name'] ?? '',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                    const SizedBox(height: 16),
                    _buildActionButtons(orderId),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildActionButtons(String orderId) {
    if (_selectedStatus == 'pending') {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: () => _updateOrderStatus(orderId, 'cooking'),
          icon: const Icon(Icons.restaurant),
          label: const Text('Comenzar a Cocinar'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.blue,
            padding: const EdgeInsets.symmetric(vertical: 12),
          ),
        ),
      );
    } else if (_selectedStatus == 'cooking') {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: () => _updateOrderStatus(orderId, 'ready'),
          icon: const Icon(Icons.check_circle),
          label: const Text('Marcar como Listo'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.green,
            padding: const EdgeInsets.symmetric(vertical: 12),
          ),
        ),
      );
    } else {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: () => _updateOrderStatus(orderId, 'completed'),
          icon: const Icon(Icons.done_all),
          label: const Text('Entregar'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.grey,
            padding: const EdgeInsets.symmetric(vertical: 12),
          ),
        ),
      );
    }
  }

  Future<void> _updateOrderStatus(String orderId, String newStatus) async {
    try {
      await _firestore.collection('orders').doc(orderId).update({
        'status': newStatus,
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('✅ Orden actualizada a $newStatus'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('❌ Error: $e')));
    }
  }

  String _formatTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 1) {
      return 'Ahora';
    } else if (difference.inMinutes < 60) {
      return 'Hace ${difference.inMinutes} min';
    } else {
      return '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
    }
  }
}
