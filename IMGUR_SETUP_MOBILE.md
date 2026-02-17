# Configuración de Imgur para Mobile (Flutter)

Esta guía complementa `IMGUR_SETUP.md` con instrucciones específicas para Flutter.

---

## 📱 Configuración en Flutter

### 1. Client ID de Imgur

Usa el **mismo Client ID** que obtuviste para la versión web (ver `IMGUR_SETUP.md`).

### 2. Configurar en Flutter

Abre `/mobile/lib/services/imgur_upload_service.dart` y reemplaza:

```dart
static const String _clientId = 'YOUR_IMGUR_CLIENT_ID';
```

Por:

```dart
static const String _clientId = 'a1b2c3d4e5f6g7h'; // Tu Client ID real
```

---

## 📦 Dependencias Instaladas

Las siguientes dependencias ya están agregadas en `pubspec.yaml`:

```yaml
dependencies:
  image_picker: ^1.0.7           # Seleccionar imágenes
  flutter_image_compress: ^2.1.0 # Comprimir imágenes
  http: ^1.2.0                   # Hacer requests HTTP
  path_provider: ^2.1.2          # Acceso a directorios
```

### Instalar dependencias:

```bash
cd mobile
flutter pub get
```

---

## 🔧 Configuración de Permisos

### Android (`android/app/src/main/AndroidManifest.xml`)

Agrega estos permisos antes de `<application>`:

```xml
<!-- Permisos para cámara y galería -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" 
                 android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.INTERNET" />

<!-- Características -->
<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
```

### iOS (`ios/Runner/Info.plist`)

Agrega estas claves dentro de `<dict>`:

```xml
<!-- Permisos para cámara y galería -->
<key>NSCameraUsageDescription</key>
<string>Necesitamos acceso a la cámara para tomar fotos de platillos</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Necesitamos acceso a la galería para seleccionar fotos de platillos</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>Necesitamos guardar fotos en tu galería</string>
```

---

## 🎯 Uso del Widget

### Ejemplo básico:

```dart
import 'package:fondita/widgets/image_upload_widget.dart';

class MyScreen extends StatefulWidget {
  @override
  State<MyScreen> createState() => _MyScreenState();
}

class _MyScreenState extends State<MyScreen> {
  String _imageUrl = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ImageUploadWidget(
        onImageUploaded: (url) {
          setState(() => _imageUrl = url);
          print('Imagen subida: $url');
        },
        currentImageUrl: _imageUrl,
        label: 'Imagen del Platillo',
      ),
    );
  }
}
```

### Ver ejemplo completo:

Abre `/mobile/lib/screens/add_dish_example.dart` para un ejemplo completo con formulario.

---

## ✨ Características del Widget

### Opciones de Selección:

1. **📸 Cámara** - Tomar foto directamente
2. **🖼️ Galería** - Seleccionar de galería
3. **🔗 URL** - Pegar URL externa

### Funcionalidades:

- ✅ Preview en tiempo real
- ✅ Barra de progreso durante upload
- ✅ Compresión automática (hasta 50MB → ~2-5MB)
- ✅ Validación de URLs
- ✅ Manejo de errores
- ✅ Botón para eliminar imagen

---

## 🗜️ Compresión de Imágenes

El servicio comprime automáticamente:

```dart
// Configuración actual:
- Tamaño máximo inicial: 50MB
- Tamaño final: ~2-5MB
- Resolución máxima: 4K (3840px)
- Calidad: 90%
- Formato: JPEG
```

### Ajustar compresión:

En `imgur_upload_service.dart`:

```dart
// Cambiar calidad (0-100)
imageToUpload = await compressImage(file, 10, 0.9); // 90%

// Cambiar resolución máxima
minWidth: 3840,  // 4K
minHeight: 3840,
```

---

## 🧪 Probar el Upload

### 1. Ejecutar la app:

```bash
cd mobile
flutter run
```

### 2. Navegar al ejemplo:

```dart
// En tu main.dart o router
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => AddDishExample()),
);
```

### 3. Probar funcionalidades:

- ✅ Tomar foto con cámara
- ✅ Seleccionar de galería
- ✅ Pegar URL de Imgur
- ✅ Ver preview
- ✅ Verificar compresión en consola

---

## 📊 Logs de Compresión

El servicio muestra logs detallados:

```
🗜️ Comprimiendo imagen...
📊 Tamaño original: 26.45MB
✅ Tamaño comprimido: 3.21MB con calidad 90%
✅ Imagen subida exitosamente: https://i.imgur.com/abc123.jpg
```

---

## 🔒 Seguridad

### ¿Es seguro el Client ID en el código?

✅ **SÍ**, el Client ID es público y está diseñado para apps móviles.

### Mejores Prácticas:

1. **Ofuscar el código** en producción:
   ```bash
   flutter build apk --obfuscate --split-debug-info=build/debug-info
   ```

2. **Usar variables de entorno** (opcional):
   ```dart
   static const String _clientId = String.fromEnvironment('IMGUR_CLIENT_ID');
   ```

---

## 🆘 Solución de Problemas

### Error: "Permission denied"

**Causa**: Permisos no configurados

**Solución**: Verifica que agregaste los permisos en `AndroidManifest.xml` e `Info.plist`

### Error: "Image picker returned null"

**Causa**: Usuario canceló la selección

**Solución**: Normal, no es un error

### Error: "Compression failed"

**Causa**: Imagen corrupta o formato no soportado

**Solución**: Intenta con otra imagen

### La imagen no se muestra

**Causa**: URL inválida o sin conexión

**Solución**: 
- Verifica conexión a internet
- Prueba abrir la URL en el navegador
- Revisa los logs de la consola

---

## 📱 Diferencias Web vs Mobile

| Característica | Web | Mobile |
|---------------|-----|--------|
| **Selección** | File picker | Cámara + Galería |
| **Compresión** | Canvas API | flutter_image_compress |
| **Preview** | `<img>` tag | Image.network() |
| **Límite** | 50MB | 50MB |
| **Calidad** | 90% | 90% |

---

## 🎉 ¡Listo!

Ahora puedes:

1. ✅ Tomar fotos con la cámara
2. ✅ Seleccionar de la galería
3. ✅ Pegar URLs externas
4. ✅ Comprimir automáticamente hasta 50MB
5. ✅ Ver preview en tiempo real
6. ✅ Subir a Imgur sin Firebase Storage

**Todo funciona igual en Web y Mobile** 🚀

---

## 📞 Soporte

Para más información sobre Imgur API:
- Documentación: https://apidocs.imgur.com/
- Límites: https://api.imgur.com/#limits
