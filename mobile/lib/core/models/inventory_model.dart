class InventoryItem {
  final String id;
  final String restaurantId;
  final String name;
  final String unit; // 'kg', 'lt', 'unit'
  final double currentStock;
  final double minStock;
  final double cost;

  InventoryItem({
    required this.id,
    required this.restaurantId,
    required this.name,
    required this.unit,
    required this.currentStock,
    required this.minStock,
    required this.cost,
  });

  factory InventoryItem.fromMap(Map<String, dynamic> data, String id) {
    return InventoryItem(
      id: id,
      restaurantId: data['restaurantId'] ?? '',
      name: data['name'] ?? '',
      unit: data['unit'] ?? 'unit',
      currentStock: (data['currentStock'] ?? 0).toDouble(),
      minStock: (data['minStock'] ?? 0).toDouble(),
      cost: (data['cost'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'restaurantId': restaurantId,
      'name': name,
      'unit': unit,
      'currentStock': currentStock,
      'minStock': minStock,
      'cost': cost,
    };
  }
}
