class Category {
  final String id;
  final String name;

  Category({required this.id, required this.name});

  factory Category.fromMap(Map<String, dynamic> data, String id) {
    return Category(id: id, name: data['name'] ?? '');
  }
}

class RecipeIngredient {
  final String ingredientId;
  final double quantity; // Quantity to deduct per dish

  RecipeIngredient({required this.ingredientId, required this.quantity});

  factory RecipeIngredient.fromMap(Map<String, dynamic> data) {
    return RecipeIngredient(
      ingredientId: data['ingredientId'] ?? '',
      quantity: (data['quantity'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toMap() {
    return {'ingredientId': ingredientId, 'quantity': quantity};
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
  final List<RecipeIngredient> recipe;

  Dish({
    required this.id,
    required this.name,
    required this.price,
    required this.description,
    required this.categoryId,
    this.imageUrl,
    required this.isAvailable,
    this.recipe = const [],
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
      recipe:
          (data['recipe'] as List<dynamic>?)
              ?.map((item) => RecipeIngredient.fromMap(item))
              .toList() ??
          [],
    );
  }
}
