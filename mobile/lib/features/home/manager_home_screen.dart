import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../screens/tables_screen.dart';
import '../../screens/attendance_screen.dart';
import '../../screens/kitchen_display_screen.dart';
import '../../screens/qr_scanner_screen.dart';
import '../../screens/settings_screen.dart';
import '../../core/theme/app_theme.dart';

class ManagerHomeScreen extends ConsumerWidget {
  const ManagerHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Panel de Jefe'),
        backgroundColor: AppColors.manager,
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
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildStatCard('Ventas Hoy', '\$1,250.00', AppColors.success),
          _buildStatCard('Pedidos Activos', '5', AppColors.accent),
          _buildStatCard('Total Platillos', '24', AppColors.secondary),
          const SizedBox(height: 20),
          const Text(
            'Acciones Rápidas',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          _buildNavigationTile(
            context,
            icon: Icons.table_restaurant,
            title: 'Gestionar Mesas',
            screen: const TablesScreen(),
          ),
          _buildNavigationTile(
            context,
            icon: Icons.restaurant_menu,
            title: 'Vista de Cocina',
            screen: const KitchenDisplayScreen(),
          ),
          _buildNavigationTile(
            context,
            icon: Icons.access_time,
            title: 'Asistencia',
            screen: const AttendanceScreen(),
          ),
          _buildNavigationTile(
            context,
            icon: Icons.qr_code_scanner,
            title: 'Escanear QR',
            screen: const QRScannerScreen(),
          ),
          ListTile(
            leading: const Icon(Icons.inventory),
            title: const Text('Gestionar Inventario'),
            trailing: const Icon(Icons.arrow_forward_ios),
            onTap: () {},
          ),
          ListTile(
            leading: const Icon(Icons.people),
            title: const Text('Gestionar Personal'),
            trailing: const Icon(Icons.arrow_forward_ios),
            onTap: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildNavigationTile(
    BuildContext context, {
    required IconData icon,
    required String title,
    required Widget screen,
  }) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      trailing: const Icon(Icons.arrow_forward_ios),
      onTap: () {
        Navigator.push(context, MaterialPageRoute(builder: (_) => screen));
      },
    );
  }

  Widget _buildStatCard(String title, String value, Color color) {
    return Card(
      elevation: 4,
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(color: Colors.grey[600], fontSize: 14),
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                color: color,
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
