class Category {
  final String id;
  final String name;

  Category({required this.id, required this.name});

  factory Category.fromMap(Map<String, dynamic> data, String id) {
    return Category(id: id, name: data['name'] ?? '');
  }
}

class Dish {
  final String id;
  final String name;
  final double price;
  final String description;
  final String categoryId;
  final String? imageUrl;
  final bool isAvailable;

  Dish({
    required this.id,
    required this.name,
    required this.price,
    required this.description,
    required this.categoryId,
    this.imageUrl,
    required this.isAvailable,
  });

  factory Dish.fromMap(Map<String, dynamic> data, String id) {
    return Dish(
      id: id,
      name: data['name'] ?? '',
      price: (data['price'] ?? 0).toDouble(),
      description: data['description'] ?? '',
      categoryId: data['categoryId'] ?? '',
      imageUrl: data['imageUrl'],
      isAvailable: data['isAvailable'] ?? true,
    );
  }
}
