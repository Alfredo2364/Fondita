import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/imgur_upload_service.dart';

/// Widget para subir imágenes a Imgur
/// Soporta selección desde galería o cámara
class ImageUploadWidget extends StatefulWidget {
  final Function(String) onImageUploaded;
  final String? currentImageUrl;
  final String label;

  const ImageUploadWidget({
    Key? key,
    required this.onImageUploaded,
    this.currentImageUrl,
    this.label = 'Imagen',
  }) : super(key: key);

  @override
  State<ImageUploadWidget> createState() => _ImageUploadWidgetState();
}

class _ImageUploadWidgetState extends State<ImageUploadWidget> {
  final ImagePicker _picker = ImagePicker();
  bool _uploading = false;
  double _progress = 0.0;
  String? _error;
  String? _imageUrl;
  final TextEditingController _urlController = TextEditingController();
  bool _useUrl = false;

  @override
  void initState() {
    super.initState();
    _imageUrl = widget.currentImageUrl;
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? image = await _picker.pickImage(
        source: source,
        maxWidth: 3840, // 4K
        maxHeight: 3840,
        imageQuality: 90,
      );

      if (image == null) return;

      setState(() {
        _uploading = true;
        _progress = 0.0;
        _error = null;
      });

      final imageFile = File(image.path);

      // Subir a Imgur
      final url = await ImgurUploadService.uploadImage(
        imageFile,
        onProgress: (progress) {
          setState(() => _progress = progress);
        },
      );

      if (url != null) {
        setState(() {
          _imageUrl = url;
          _error = null;
        });
        widget.onImageUploaded(url);
      } else {
        setState(() {
          _error = 'Error al subir imagen';
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Error: $e';
      });
    } finally {
      setState(() {
        _uploading = false;
        _progress = 0.0;
      });
    }
  }

  void _submitUrl() {
    final url = _urlController.text.trim();

    if (url.isEmpty) {
      setState(() => _error = 'Por favor ingresa una URL');
      return;
    }

    if (!ImgurUploadService.isValidImageUrl(url)) {
      setState(() => _error = 'URL de imagen no válida');
      return;
    }

    setState(() {
      _imageUrl = url;
      _error = null;
    });
    widget.onImageUploaded(url);
    _urlController.clear();
  }

  void _removeImage() {
    setState(() {
      _imageUrl = null;
      _error = null;
    });
    widget.onImageUploaded('');
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.label,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
        ),
        const SizedBox(height: 12),

        // Selector de modo
        Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () => setState(() => _useUrl = false),
                icon: const Icon(Icons.upload_file),
                label: const Text('Subir Archivo'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: !_useUrl
                      ? Theme.of(context).primaryColor
                      : Colors.grey[300],
                  foregroundColor: !_useUrl ? Colors.white : Colors.black87,
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () => setState(() => _useUrl = true),
                icon: const Icon(Icons.link),
                label: const Text('Pegar URL'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: _useUrl
                      ? Theme.of(context).primaryColor
                      : Colors.grey[300],
                  foregroundColor: _useUrl ? Colors.white : Colors.black87,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Preview de imagen
        if (_imageUrl != null)
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(
                  _imageUrl!,
                  height: 200,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      height: 200,
                      color: Colors.grey[300],
                      child: const Center(
                        child: Icon(Icons.error, size: 48, color: Colors.red),
                      ),
                    );
                  },
                ),
              ),
              Positioned(
                top: 8,
                right: 8,
                child: IconButton(
                  onPressed: _removeImage,
                  icon: const Icon(Icons.close),
                  style: IconButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                  ),
                ),
              ),
            ],
          ),

        const SizedBox(height: 16),

        // Modo: Subir archivo
        if (!_useUrl && _imageUrl == null)
          Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _uploading
                          ? null
                          : () => _pickImage(ImageSource.gallery),
                      icon: const Icon(Icons.photo_library),
                      label: const Text('Galería'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.all(16),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _uploading
                          ? null
                          : () => _pickImage(ImageSource.camera),
                      icon: const Icon(Icons.camera_alt),
                      label: const Text('Cámara'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.all(16),
                      ),
                    ),
                  ),
                ],
              ),
              if (_uploading) ...[
                const SizedBox(height: 16),
                LinearProgressIndicator(value: _progress),
                const SizedBox(height: 8),
                Text('${(_progress * 100).toInt()}%'),
              ],
            ],
          ),

        // Modo: Pegar URL
        if (_useUrl)
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _urlController,
                  decoration: const InputDecoration(
                    hintText: 'https://i.imgur.com/ejemplo.jpg',
                    border: OutlineInputBorder(),
                  ),
                  onSubmitted: (_) => _submitUrl(),
                ),
              ),
              const SizedBox(width: 8),
              ElevatedButton(
                onPressed: _submitUrl,
                child: const Text('Agregar'),
              ),
            ],
          ),

        // Error
        if (_error != null)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Text(_error!, style: const TextStyle(color: Colors.red)),
          ),

        // Información
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.blue[50],
            borderRadius: BorderRadius.circular(8),
          ),
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '💡 Consejos:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 4),
              Text(
                '• Puedes subir imágenes de hasta 50MB',
                style: TextStyle(fontSize: 12),
              ),
              Text(
                '• Se comprimen automáticamente a ~2-5MB',
                style: TextStyle(fontSize: 12),
              ),
              Text(
                '• Resolución máxima: 4K (3840px)',
                style: TextStyle(fontSize: 12),
              ),
              Text(
                '• También puedes pegar URLs externas',
                style: TextStyle(fontSize: 12),
              ),
            ],
          ),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _urlController.dispose();
    super.dispose();
  }
}
