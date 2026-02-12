class TableModel {
  final String id;
  final int number;
  final int capacity;
  final String status; // 'available', 'occupied', 'reserved'
  final String? currentOrderId;

  TableModel({
    required this.id,
    required this.number,
    required this.capacity,
    required this.status,
    this.currentOrderId,
  });

  factory TableModel.fromMap(Map<String, dynamic> data, String id) {
    return TableModel(
      id: id,
      number: data['number'] ?? 0,
      capacity: data['capacity'] ?? 0,
      status: data['status'] ?? 'available',
      currentOrderId: data['currentOrderId'],
    );
  }
}
