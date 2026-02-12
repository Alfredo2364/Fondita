import 'package:cloud_firestore/cloud_firestore.dart';

class UserModel {
  final String id;
  final String name;
  final String email;
  final String role; // 'admin', 'staff', 'customer'
  final DateTime createdAt;
  final String? restaurantId;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.createdAt,
    this.restaurantId,
  });

  factory UserModel.fromMap(Map<String, dynamic> data, String id) {
    return UserModel(
      id: id,
      name: data['name'] ?? '',
      email: data['email'] ?? '',
      role: data['role'] ?? 'customer',
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      restaurantId: data['restaurantId'],
    );
  }
}
