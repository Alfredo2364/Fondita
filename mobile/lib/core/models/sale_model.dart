import 'package:cloud_firestore/cloud_firestore.dart';

class SaleDetail {
  final String menuItemId;
  final String name;
  final int quantity;
  final double unitPrice;
  final double subtotal;

  SaleDetail({
    required this.menuItemId,
    required this.name,
    required this.quantity,
    required this.unitPrice,
    required this.subtotal,
  });

  factory SaleDetail.fromMap(Map<String, dynamic> data) {
    return SaleDetail(
      menuItemId: data['menuItemId'] ?? '',
      name: data['name'] ?? '',
      quantity: data['quantity'] ?? 0,
      unitPrice: (data['unitPrice'] ?? 0).toDouble(),
      subtotal: (data['subtotal'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'menuItemId': menuItemId,
      'name': name,
      'quantity': quantity,
      'unitPrice': unitPrice,
      'subtotal': subtotal,
    };
  }
}

class Sale {
  final String id;
  final String restaurantId;
  final String employeeId;
  final String? tableId;
  final double total;
  final String paymentMethod;
  final DateTime timestamp;
  final List<SaleDetail> items;

  Sale({
    required this.id,
    required this.restaurantId,
    required this.employeeId,
    this.tableId,
    required this.total,
    required this.paymentMethod,
    required this.timestamp,
    required this.items,
  });

  factory Sale.fromMap(Map<String, dynamic> data, String id) {
    return Sale(
      id: id,
      restaurantId: data['restaurantId'] ?? '',
      employeeId: data['employeeId'] ?? '',
      tableId: data['tableId'],
      total: (data['total'] ?? 0).toDouble(),
      paymentMethod: data['paymentMethod'] ?? 'cash',
      timestamp: (data['timestamp'] as Timestamp).toDate(),
      items:
          (data['items'] as List<dynamic>?)
              ?.map((item) => SaleDetail.fromMap(item))
              .toList() ??
          [],
    );
  }
}
