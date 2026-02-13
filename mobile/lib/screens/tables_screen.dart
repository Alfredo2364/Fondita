import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class TablesScreen extends StatefulWidget {
  const TablesScreen({Key? key}) : super(key: key);

  @override
  State<TablesScreen> createState() => _TablesScreenState();
}

class _TablesScreenState extends State<TablesScreen> {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final String restaurantId = 'default_restaurant';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mesas'),
        backgroundColor: Colors.orange,
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: _firestore
            .collection('tables')
            .where('restaurantId', isEqualTo: restaurantId)
            .orderBy('number')
            .snapshots(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final tables = snapshot.data?.docs ?? [];

          if (tables.isEmpty) {
            return const Center(child: Text('No hay mesas disponibles'));
          }

          return GridView.builder(
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: 1.2,
            ),
            itemCount: tables.length,
            itemBuilder: (context, index) {
              final table = tables[index].data() as Map<String, dynamic>;
              final tableId = tables[index].id;
              final number = table['number'] ?? 0;
              final capacity = table['capacity'] ?? 0;
              final status = table['status'] ?? 'available';
              final qrCode = table['qrCode'] ?? '';

              Color statusColor;
              IconData statusIcon;
              String statusText;

              switch (status) {
                case 'occupied':
                  statusColor = Colors.red;
                  statusIcon = Icons.people;
                  statusText = 'Ocupada';
                  break;
                case 'reserved':
                  statusColor = Colors.orange;
                  statusIcon = Icons.event;
                  statusText = 'Reservada';
                  break;
                default:
                  statusColor = Colors.green;
                  statusIcon = Icons.check_circle;
                  statusText = 'Disponible';
              }

              return Card(
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: InkWell(
                  onTap: () {
                    _showTableDetails(context, tableId, table);
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          statusColor.withOpacity(0.1),
                          statusColor.withOpacity(0.05),
                        ],
                      ),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(statusIcon, size: 48, color: statusColor),
                          const SizedBox(height: 8),
                          Text(
                            'Mesa $number',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '$capacity personas',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[600],
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: statusColor,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              statusText,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  void _showTableDetails(
    BuildContext context,
    String tableId,
    Map<String, dynamic> table,
  ) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Mesa ${table['number']}',
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              _buildDetailRow(
                Icons.people,
                'Capacidad',
                '${table['capacity']} personas',
              ),
              _buildDetailRow(
                Icons.qr_code,
                'QR Code',
                table['qrCode'] ?? 'No disponible',
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        _updateTableStatus(tableId, 'available');
                      },
                      icon: const Icon(Icons.check_circle),
                      label: const Text('Disponible'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        _updateTableStatus(tableId, 'occupied');
                      },
                      icon: const Icon(Icons.people),
                      label: const Text('Ocupada'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, color: Colors.grey[600]),
          const SizedBox(width: 12),
          Text(
            '$label: ',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(fontSize: 16, color: Colors.grey[700]),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _updateTableStatus(String tableId, String status) async {
    try {
      await _firestore.collection('tables').doc(tableId).update({
        'status': status,
      });
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Estado actualizado a $status')));
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }
}
