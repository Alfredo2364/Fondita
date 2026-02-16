import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../core/theme/app_theme.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({Key? key}) : super(key: key);

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final String restaurantId = 'default_restaurant';

  bool _isCheckedIn = false;
  String? _currentAttendanceId;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _checkCurrentAttendance();
  }

  Future<void> _checkCurrentAttendance() async {
    final user = _auth.currentUser;
    if (user == null) return;

    try {
      final today = DateTime.now();
      final startOfDay = DateTime(today.year, today.month, today.day);

      final snapshot = await _firestore
          .collection('attendance')
          .where('restaurantId', isEqualTo: restaurantId)
          .where('userId', isEqualTo: user.uid)
          .where(
            'checkIn',
            isGreaterThanOrEqualTo: Timestamp.fromDate(startOfDay),
          )
          .where('checkOut', isEqualTo: null)
          .limit(1)
          .get();

      if (snapshot.docs.isNotEmpty) {
        setState(() {
          _isCheckedIn = true;
          _currentAttendanceId = snapshot.docs.first.id;
          _loading = false;
        });
      } else {
        setState(() {
          _isCheckedIn = false;
          _loading = false;
        });
      }
    } catch (e) {
      print('Error checking attendance: $e');
      setState(() => _loading = false);
    }
  }

  Future<void> _handleCheckIn() async {
    final user = _auth.currentUser;
    if (user == null) return;

    try {
      final userDoc = await _firestore.collection('users').doc(user.uid).get();
      final userName = userDoc.data()?['name'] ?? user.email ?? 'Usuario';

      final docRef = await _firestore.collection('attendance').add({
        'restaurantId': restaurantId,
        'userId': user.uid,
        'userName': userName,
        'checkIn': FieldValue.serverTimestamp(),
        'checkOut': null,
      });

      setState(() {
        _isCheckedIn = true;
        _currentAttendanceId = docRef.id;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✅ Check-in registrado'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('❌ Error: $e')));
    }
  }

  Future<void> _handleCheckOut() async {
    if (_currentAttendanceId == null) return;

    try {
      await _firestore
          .collection('attendance')
          .doc(_currentAttendanceId)
          .update({'checkOut': FieldValue.serverTimestamp()});

      setState(() {
        _isCheckedIn = false;
        _currentAttendanceId = null;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✅ Check-out registrado'),
          backgroundColor: Colors.orange,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('❌ Error: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Asistencia'),
        backgroundColor: AppColors.secondary,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                _isCheckedIn ? Icons.check_circle : Icons.access_time,
                size: 120,
                color: _isCheckedIn ? AppColors.success : AppColors.textLight,
              ),
              const SizedBox(height: 24),
              Text(
                _isCheckedIn ? 'Estás en turno' : 'Fuera de turno',
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                _isCheckedIn
                    ? 'Registra tu salida al terminar tu turno'
                    : 'Registra tu entrada para comenzar tu turno',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: Colors.grey[600]),
              ),
              const SizedBox(height: 48),
              SizedBox(
                width: double.infinity,
                height: 60,
                child: ElevatedButton.icon(
                  onPressed: _isCheckedIn ? _handleCheckOut : _handleCheckIn,
                  icon: Icon(
                    _isCheckedIn ? Icons.logout : Icons.login,
                    size: 28,
                  ),
                  label: Text(
                    _isCheckedIn ? 'CHECK-OUT' : 'CHECK-IN',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _isCheckedIn
                        ? AppColors.warning
                        : AppColors.success,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              _buildAttendanceHistory(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAttendanceHistory() {
    final user = _auth.currentUser;
    if (user == null) return const SizedBox();

    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 16),
            child: Text(
              'Historial de Hoy',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream: _firestore
                  .collection('attendance')
                  .where('restaurantId', isEqualTo: restaurantId)
                  .where('userId', isEqualTo: user.uid)
                  .orderBy('checkIn', descending: true)
                  .limit(5)
                  .snapshots(),
              builder: (context, snapshot) {
                if (!snapshot.hasData) {
                  return const Center(child: CircularProgressIndicator());
                }

                final records = snapshot.data!.docs;

                if (records.isEmpty) {
                  return const Center(child: Text('No hay registros'));
                }

                return ListView.builder(
                  itemCount: records.length,
                  itemBuilder: (context, index) {
                    final record =
                        records[index].data() as Map<String, dynamic>;
                    final checkIn = (record['checkIn'] as Timestamp?)?.toDate();
                    final checkOut = (record['checkOut'] as Timestamp?)
                        ?.toDate();

                    return Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        leading: Icon(
                          checkOut != null
                              ? Icons.check_circle
                              : Icons.access_time,
                          color: checkOut != null
                              ? Colors.green
                              : Colors.orange,
                        ),
                        title: Text(
                          checkIn != null
                              ? 'Entrada: ${_formatTime(checkIn)}'
                              : 'Sin registro',
                        ),
                        subtitle: Text(
                          checkOut != null
                              ? 'Salida: ${_formatTime(checkOut)}'
                              : 'En turno',
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime dateTime) {
    return '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }
}
