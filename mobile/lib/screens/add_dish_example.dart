import 'package:flutter/material.dart';
import '../widgets/image_upload_widget.dart';

/// Ejemplo de uso del widget de upload de imágenes
/// Puedes usar esto como referencia para agregar platillos
class AddDishExample extends StatefulWidget {
  const AddDishExample({Key? key}) : super(key: key);

  @override
  State<AddDishExample> createState() => _AddDishExampleState();
}

class _AddDishExampleState extends State<AddDishExample> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _priceController = TextEditingController();
  String _imageUrl = '';

  void _saveDish() {
    if (_formKey.currentState!.validate()) {
      if (_imageUrl.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Por favor selecciona una imagen')),
        );
        return;
      }

      // Aquí guardarías en Firestore
      final dishData = {
        'name': _nameController.text,
        'description': _descriptionController.text,
        'price': double.parse(_priceController.text),
        'imageUrl': _imageUrl,
        'createdAt': DateTime.now(),
      };

      print('Datos del platillo: $dishData');

      // Ejemplo de guardado en Firestore:
      // FirebaseFirestore.instance.collection('dishes').add(dishData);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Platillo guardado exitosamente')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Agregar Platillo')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Nombre
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Nombre del Platillo',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor ingresa un nombre';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Descripción
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(
                  labelText: 'Descripción',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor ingresa una descripción';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Precio
              TextFormField(
                controller: _priceController,
                decoration: const InputDecoration(
                  labelText: 'Precio',
                  border: OutlineInputBorder(),
                  prefixText: '\$',
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor ingresa un precio';
                  }
                  if (double.tryParse(value) == null) {
                    return 'Ingresa un número válido';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),

              // WIDGET DE UPLOAD DE IMAGEN
              ImageUploadWidget(
                onImageUploaded: (url) {
                  setState(() => _imageUrl = url);
                },
                currentImageUrl: _imageUrl,
                label: 'Imagen del Platillo',
              ),
              const SizedBox(height: 24),

              // Botón de guardar
              ElevatedButton(
                onPressed: _saveDish,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.all(16),
                ),
                child: const Text(
                  'Guardar Platillo',
                  style: TextStyle(fontSize: 16),
                ),
              ),

              // Debug: Mostrar datos actuales
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Datos actuales:',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Text('Nombre: ${_nameController.text}'),
                    Text('Descripción: ${_descriptionController.text}'),
                    Text('Precio: \$${_priceController.text}'),
                    Text(
                      'Imagen URL: ${_imageUrl.isEmpty ? "(vacío)" : _imageUrl}',
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    super.dispose();
  }
}
