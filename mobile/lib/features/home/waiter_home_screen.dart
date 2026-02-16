import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../core/models/table_model.dart';
import '../../features/table/table_detail_screen.dart';
import '../../screens/attendance_screen.dart';
import '../../screens/settings_screen.dart';
import '../../core/theme/app_theme.dart';

final tablesProvider = StreamProvider<List<TableModel>>((ref) {
  return FirebaseFirestore.instance
      .collection('tables')
      .orderBy('number')
      .snapshots()
      .map(
        (snapshot) => snapshot.docs
            .map((doc) => TableModel.fromMap(doc.data(), doc.id))
            .toList(),
      );
});

class WaiterHomeScreen extends ConsumerWidget {
  const WaiterHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tablesAsync = ref.watch(tablesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Modo Mesero'),
        backgroundColor: AppColors.waiter,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const SettingsScreen()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => FirebaseAuth.instance.signOut(),
          ),
        ],
      ),
      body: tablesAsync.when(
        data: (tables) {
          if (tables.isEmpty) {
            return const Center(child: Text('No hay mesas registradas.'));
          }
          return GridView.builder(
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemCount: tables.length,
            itemBuilder: (context, index) {
              final table = tables[index];
              final isOccupied = table.status == 'occupied';

              return Card(
                color: isOccupied
                    ? AppColors.tableOccupied.withOpacity(0.1)
                    : AppColors.tableAvailable.withOpacity(0.1),
                child: InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => TableDetailScreen(table: table),
                      ),
                    );
                  },
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.table_restaurant,
                        size: 48,
                        color: isOccupied
                            ? AppColors.tableOccupied
                            : AppColors.tableAvailable,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Mesa ${table.number}',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        isOccupied ? 'Ocupada' : 'Disponible',
                        style: TextStyle(
                          color: isOccupied
                              ? AppColors.tableOccupied
                              : AppColors.tableAvailable,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        'Cap: ${table.capacity}',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, s) => Center(child: Text('Error: $e')),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AttendanceScreen()),
          );
        },
        icon: const Icon(Icons.access_time),
        label: const Text('Asistencia'),
        backgroundColor: AppColors.accent,
      ),
    );
  }
}
