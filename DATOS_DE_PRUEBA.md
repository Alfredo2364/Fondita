# Datos de Prueba para Fondita

Este archivo contiene ejemplos de datos que puedes copiar y pegar en Firestore para probar el sistema.

---

## 📋 Categorías de Ejemplo

### Categoría 1: Platillos Principales
```json
{
  "name": "Platillos Principales",
  "description": "Nuestros platillos más populares",
  "icon": "🍽️",
  "order": 1
}
```

### Categoría 2: Bebidas
```json
{
  "name": "Bebidas",
  "description": "Refrescantes bebidas",
  "icon": "🥤",
  "order": 2
}
```

---

## 🍕 Platillos de Ejemplo (CON IMAGEN DE IMGUR)

### Platillo 1: Pizza Especial (CON TU IMAGEN)
```json
{
  "name": "Pizza Especial",
  "description": "Deliciosa pizza con ingredientes frescos",
  "price": 150,
  "categoryId": "PEGAR_ID_DE_CATEGORIA_AQUI",
  "imageUrl": "https://i.imgur.com/FQ2nca9.png",
  "available": true,
  "ingredients": ["Queso", "Tomate", "Pepperoni", "Champiñones"],
  "preparationTime": 20,
  "calories": 850
}
```

### Platillo 2: Tacos al Pastor (Imagen de Unsplash)
```json
{
  "name": "Tacos al Pastor",
  "description": "3 tacos con carne al pastor, piña y cilantro",
  "price": 75,
  "categoryId": "PEGAR_ID_DE_CATEGORIA_AQUI",
  "imageUrl": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
  "available": true,
  "ingredients": ["Tortilla", "Carne al pastor", "Piña", "Cilantro", "Cebolla"],
  "preparationTime": 15,
  "calories": 450
}
```

### Platillo 3: Hamburguesa Clásica (Imagen de Unsplash)
```json
{
  "name": "Hamburguesa Clásica",
  "description": "Hamburguesa con queso, lechuga, tomate y papas",
  "price": 120,
  "categoryId": "PEGAR_ID_DE_CATEGORIA_AQUI",
  "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
  "available": true,
  "ingredients": ["Pan", "Carne", "Queso", "Lechuga", "Tomate", "Papas"],
  "preparationTime": 18,
  "calories": 720
}
```

### Platillo 4: Ensalada César (Imagen de Unsplash)
```json
{
  "name": "Ensalada César",
  "description": "Fresca ensalada con pollo y aderezo césar",
  "price": 95,
  "categoryId": "PEGAR_ID_DE_CATEGORIA_AQUI",
  "imageUrl": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
  "available": true,
  "ingredients": ["Lechuga romana", "Pollo", "Crutones", "Queso parmesano", "Aderezo césar"],
  "preparationTime": 10,
  "calories": 380
}
```

---

## 🪑 Mesas de Ejemplo

### Mesa 1
```json
{
  "number": 1,
  "capacity": 4,
  "status": "available",
  "location": "Terraza"
}
```

### Mesa 2
```json
{
  "number": 2,
  "capacity": 2,
  "status": "available",
  "location": "Interior"
}
```

### Mesa 3
```json
{
  "number": 3,
  "capacity": 6,
  "status": "available",
  "location": "Salón principal"
}
```

---

## 📦 Productos de Inventario

### Producto 1: Tomates
```json
{
  "name": "Tomates",
  "category": "Verduras",
  "quantity": 50,
  "unit": "kg",
  "minStock": 10,
  "price": 25,
  "supplier": "Verduras Frescas SA"
}
```

### Producto 2: Queso Mozzarella
```json
{
  "name": "Queso Mozzarella",
  "category": "Lácteos",
  "quantity": 20,
  "unit": "kg",
  "minStock": 5,
  "price": 180,
  "supplier": "Lácteos del Valle"
}
```

### Producto 3: Carne de Res
```json
{
  "name": "Carne de Res",
  "category": "Carnes",
  "quantity": 30,
  "unit": "kg",
  "minStock": 8,
  "price": 220,
  "supplier": "Carnes Premium"
}
```

---

## 👥 Usuarios de Ejemplo

### Usuario Admin (YA CREADO)
```json
{
  "email": "admin@fondita.com",
  "name": "Administrador",
  "role": "admin",
  "createdAt": "TIMESTAMP_ACTUAL"
}
```

### Usuario Staff
```json
{
  "email": "mesero@fondita.com",
  "name": "Juan Pérez",
  "role": "staff",
  "createdAt": "TIMESTAMP_ACTUAL"
}
```

### Usuario Cocina
```json
{
  "email": "cocina@fondita.com",
  "name": "María García",
  "role": "kitchen",
  "createdAt": "TIMESTAMP_ACTUAL"
}
```

---

## 🧪 Cómo Usar Estos Datos

### Paso 1: Crear Categorías
1. Ve a Firestore → Colección `categories`
2. Click "Agregar documento"
3. Deja que Firebase genere el ID automáticamente
4. Copia y pega los campos de "Categoría 1"
5. **COPIA EL ID** generado
6. Repite para "Categoría 2"

### Paso 2: Crear Platillos
1. Ve a Firestore → Colección `dishes`
2. Click "Agregar documento"
3. Copia los campos de "Platillo 1: Pizza Especial"
4. **IMPORTANTE**: En el campo `categoryId`, **PEGA EL ID** que copiaste de la categoría
5. La imagen se cargará automáticamente desde Imgur: `https://i.imgur.com/FQ2nca9.png`
6. Repite para los demás platillos

### Paso 3: Crear Mesas
1. Ve a Firestore → Colección `tables`
2. Agrega las 3 mesas de ejemplo

### Paso 4: Crear Inventario
1. Ve a Firestore → Colección `inventory`
2. Agrega los productos de ejemplo

### Paso 5: Probar en la App
1. Inicia sesión con `admin@fondita.com`
2. Ve a "Menú" para ver los platillos con imágenes
3. Ve a "Mesas" para ver las mesas disponibles
4. Ve a "Inventario" para ver los productos

---

## 🎨 URLs de Imágenes Útiles (Unsplash)

### Comida Mexicana
- Tacos: `https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400`
- Quesadillas: `https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400`
- Enchiladas: `https://images.unsplash.com/photo-1599974982760-46f2a3e6c5a5?w=400`

### Comida Internacional
- Pizza: `https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400`
- Hamburguesa: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400`
- Pasta: `https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400`
- Sushi: `https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400`

### Bebidas
- Café: `https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400`
- Jugo: `https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400`
- Refresco: `https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400`

### Postres
- Pastel: `https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400`
- Helado: `https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400`
- Flan: `https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400`

---

## ✅ Verificación

Después de agregar los datos, verifica:

1. **Web**: `http://localhost:3000/dashboard/menu`
   - Deberías ver los platillos con imágenes
   
2. **Mobile**: Abre la app
   - Ve a "Menú"
   - Las imágenes deberían cargar desde las URLs

3. **Firestore**: 
   - Verifica que todos los documentos tengan el campo `imageUrl`
   - Las URLs deben empezar con `https://`

---

## 🔗 Tu Imagen de Imgur

**URL Directa**: `https://i.imgur.com/FQ2nca9.png`

Esta URL ya está incluida en el "Platillo 1: Pizza Especial" arriba. Cuando agregues ese platillo a Firestore, la imagen se mostrará automáticamente en la app.

---

## 💡 Consejos

1. **Siempre usa URLs directas** que terminen en `.jpg`, `.png`, `.webp`
2. **Unsplash es gratis** y tiene imágenes de alta calidad
3. **Imgur funciona perfecto** para tus propias imágenes
4. **Agrega `?w=400`** al final de URLs de Unsplash para optimizar tamaño
5. **Prueba las URLs** en el navegador antes de agregarlas

¡Listo para probar! 🚀
