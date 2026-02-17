import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:path_provider/path_provider.dart';

/// Servicio para subir imágenes a Imgur
/// Soporta imágenes de hasta 50MB con compresión automática
class ImgurUploadService {
  // Reemplazar con tu Client ID de Imgur
  static const String _clientId = 'YOUR_IMGUR_CLIENT_ID';
  static const String _uploadUrl = 'https://api.imgur.com/3/image';

  /// Resultado del upload
  static const int maxInitialSizeMB = 50;
  static const int maxCompressedSizeMB = 10;

  /// Comprime una imagen antes de subirla
  ///
  /// [imageFile] Archivo de imagen original
  /// [quality] Calidad de compresión (0-100), default 90
  /// Returns archivo comprimido
  static Future<File?> compressImage(File imageFile, {int quality = 90}) async {
    try {
      // Obtener tamaño original
      final originalSize = await imageFile.length();
      final originalSizeMB = originalSize / (1024 * 1024);

      print('🗜️ Comprimiendo imagen...');
      print('📊 Tamaño original: ${originalSizeMB.toStringAsFixed(2)}MB');

      // Si es menor a 500KB, no comprimir
      if (originalSize < 500 * 1024) {
        print('✅ Imagen pequeña, no requiere compresión');
        return imageFile;
      }

      // Obtener directorio temporal
      final tempDir = await getTemporaryDirectory();
      final targetPath =
          '${tempDir.path}/compressed_${DateTime.now().millisecondsSinceEpoch}.jpg';

      // Comprimir imagen
      final compressedFile = await FlutterImageCompress.compressAndGetFile(
        imageFile.absolute.path,
        targetPath,
        quality: quality,
        minWidth: 3840, // 4K para excelente calidad
        minHeight: 3840,
        format: CompressFormat.jpeg,
      );

      if (compressedFile == null) {
        print('⚠️ Error al comprimir, usando original');
        return imageFile;
      }

      final compressedSize = await compressedFile.length();
      final compressedSizeMB = compressedSize / (1024 * 1024);

      print(
        '✅ Tamaño comprimido: ${compressedSizeMB.toStringAsFixed(2)}MB con calidad $quality%',
      );

      // Si aún es muy grande, reducir calidad
      if (compressedSizeMB > maxCompressedSizeMB && quality > 50) {
        print(
          '🔄 Reduciendo calidad para alcanzar ${maxCompressedSizeMB}MB...',
        );
        return await compressImage(imageFile, quality: quality - 10);
      }

      return File(compressedFile.path);
    } catch (e) {
      print('❌ Error al comprimir imagen: $e');
      return imageFile;
    }
  }

  /// Sube una imagen a Imgur
  ///
  /// [imageFile] Archivo de imagen a subir
  /// [onProgress] Callback de progreso (0.0 - 1.0)
  /// Returns URL de la imagen subida o null si falla
  static Future<String?> uploadImage(
    File imageFile, {
    Function(double)? onProgress,
  }) async {
    try {
      // Validar tamaño inicial
      final fileSize = await imageFile.length();
      final fileSizeMB = fileSize / (1024 * 1024);

      if (fileSizeMB > maxInitialSizeMB) {
        throw Exception(
          'La imagen es demasiado grande. Máximo ${maxInitialSizeMB}MB.',
        );
      }

      onProgress?.call(0.1);

      // Comprimir imagen
      final compressedFile = await compressImage(imageFile);
      if (compressedFile == null) {
        throw Exception('Error al comprimir imagen');
      }

      onProgress?.call(0.3);

      // Convertir a Base64
      final bytes = await compressedFile.readAsBytes();
      final base64Image = base64Encode(bytes);

      onProgress?.call(0.5);

      // Subir a Imgur
      final response = await http.post(
        Uri.parse(_uploadUrl),
        headers: {
          'Authorization': 'Client-ID $_clientId',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'image': base64Image, 'type': 'base64'}),
      );

      onProgress?.call(0.8);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final imageUrl = data['data']['link'] as String;

        onProgress?.call(1.0);
        print('✅ Imagen subida exitosamente: $imageUrl');

        return imageUrl;
      } else {
        final errorData = jsonDecode(response.body);
        throw Exception(
          'Error al subir: ${errorData['data']?['error'] ?? response.statusCode}',
        );
      }
    } catch (e) {
      print('❌ Error al subir imagen: $e');
      return null;
    }
  }

  /// Valida si una URL de imagen es válida
  static bool isValidImageUrl(String url) {
    try {
      final uri = Uri.parse(url);
      final validExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.webp',
        '.bmp',
      ];
      final path = uri.path.toLowerCase();

      return validExtensions.any((ext) => path.endsWith(ext)) ||
          (path.contains('/') && !path.endsWith('/'));
    } catch (e) {
      return false;
    }
  }
}
