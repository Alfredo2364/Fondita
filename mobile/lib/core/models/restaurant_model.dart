import 'package:cloud_firestore/cloud_firestore.dart';

class Restaurant {
  final String id;
  final String name;
  final String address;
  final String ownerId;
  final DateTime createdAt;

  Restaurant({
    required this.id,
    required this.name,
    required this.address,
    required this.ownerId,
    required this.createdAt,
  });

  factory Restaurant.fromMap(Map<String, dynamic> data, String id) {
    return Restaurant(
      id: id,
      name: data['name'] ?? '',
      address: data['address'] ?? '',
      ownerId: data['ownerId'] ?? '',
      createdAt: (data['createdAt'] as Timestamp).toDate(),
    );
  }
}
