# Guía: Configurar Imgur API para Upload de Imágenes

Esta guía te muestra cómo obtener tu **Client ID** de Imgur para habilitar el upload de imágenes desde la interfaz.

---

## 📝 Paso 1: Crear Cuenta en Imgur

1. Ve a https://imgur.com/
2. Click en **"Sign up"** (Registrarse)
3. Crea una cuenta con email o usa Google/Facebook
4. Verifica tu email

---

## 🔑 Paso 2: Registrar tu Aplicación

1. **Inicia sesión** en Imgur
2. Ve a: https://api.imgur.com/oauth2/addclient
3. Llena el formulario:

### Información de la Aplicación

| Campo | Valor |
|-------|-------|
| **Application name** | `Fondita` |
| **Authorization type** | Selecciona: **"OAuth 2 authorization without a callback URL"** |
| **Authorization callback URL** | Deja vacío o pon: `http://localhost:3000` |
| **Application website** | `http://localhost:3000` (o tu dominio) |
| **Email** | Tu email |
| **Description** | `Sistema de gestión para restaurantes` |

4. Acepta los términos
5. Click **"Submit"**

---

## 📋 Paso 3: Obtener Client ID

Después de registrar, verás una página con:

```
Client ID: abc123def456...
Client Secret: xyz789...
```

**SOLO necesitas el Client ID** (el Client Secret no es necesario para uploads anónimos).

**COPIA** el `Client ID` (algo como: `a1b2c3d4e5f6g7h`)

---

## ⚙️ Paso 4: Configurar en Fondita

### Opción A: Variable de Entorno (Recomendado)

1. Abre `/web/.env.local`
2. Agrega esta línea:

```env
NEXT_PUBLIC_IMGUR_CLIENT_ID=TU_CLIENT_ID_AQUI
```

3. Actualiza `/web/src/lib/imgurUpload.ts`:

```typescript
const IMGUR_CLIENT_ID = process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID || '';
```

### Opción B: Hardcoded (Más simple)

1. Abre `/web/src/lib/imgurUpload.ts`
2. Reemplaza la línea:

```typescript
const IMGUR_CLIENT_ID = 'YOUR_IMGUR_CLIENT_ID';
```

Por:

```typescript
const IMGUR_CLIENT_ID = 'a1b2c3d4e5f6g7h'; // Tu Client ID real
```

---

## ✅ Paso 5: Probar el Upload

1. **Reinicia el servidor**:
   ```bash
   cd web
   npm run dev
   ```

2. **Ve a agregar platillo**:
   - Login como admin
   - Dashboard → Menú → Agregar Platillo
   - Verás el componente de upload

3. **Prueba subir una imagen**:
   - Click en "Subir Archivo"
   - Selecciona una imagen
   - Debería subirse a Imgur automáticamente

---

## 🎯 Uso del Componente

### En cualquier formulario:

```tsx
import ImageUploader from '@/components/ImageUploader';

// En tu componente
const [imageUrl, setImageUrl] = useState('');

<ImageUploader
  onImageUploaded={(url) => setImageUrl(url)}
  currentImageUrl={imageUrl}
  label="Imagen del Platillo"
  maxSizeMB={10}
/>
```

---

## 📊 Límites de Imgur (Plan Gratuito)

| Límite | Valor |
|--------|-------|
| **Uploads por día** | 12,500 |
| **Tamaño máximo** | 20MB (antes de comprimir) |
| **Tamaño recomendado** | 10MB (después de comprimir) |
| **Ancho de banda** | Ilimitado |
| **Almacenamiento** | Ilimitado |
| **Duración** | Permanente |

**Nota**: Con 12,500 uploads/día, puedes subir ~520 imágenes por hora. Más que suficiente para un restaurante.

---

## 🔒 Seguridad

### ¿Es seguro exponer el Client ID?

✅ **SÍ**, el Client ID es público y está diseñado para usarse en el frontend.

❌ **NO expongas** el Client Secret (pero no lo necesitas para uploads anónimos).

### Mejores Prácticas

1. **Usa variables de entorno** para producción
2. **No subas** `.env.local` a Git (ya está en `.gitignore`)
3. **Regenera** el Client ID si lo expones accidentalmente

---

## 🆘 Solución de Problemas

### Error: "Invalid client_id"

- Verifica que copiaste el Client ID completo
- Asegúrate de no tener espacios extras
- Reinicia el servidor después de cambiar `.env.local`

### Error: "Rate limit exceeded"

- Has superado 12,500 uploads en 24 horas
- Espera 24 horas o crea otra aplicación

### Error: "Image too large"

- La imagen es mayor a 20MB antes de comprimir
- Reduce el tamaño de la imagen original
- O ajusta la compresión en `imgurUpload.ts`

### La imagen no se muestra

- Verifica que la URL sea correcta
- Revisa la consola del navegador para errores
- Prueba abrir la URL directamente en el navegador

---

## 🎨 Características del Sistema

### ✅ Lo que PUEDE hacer:

- ✅ Subir imágenes desde el navegador
- ✅ Comprimir automáticamente imágenes grandes
- ✅ Preview antes de guardar
- ✅ Pegar URLs externas (Imgur, Unsplash, etc.)
- ✅ Barra de progreso durante upload
- ✅ Validación de tipo y tamaño
- ✅ Manejo de errores

### ❌ Lo que NO necesita:

- ❌ Firebase Storage
- ❌ Tarjeta de crédito
- ❌ Backend propio
- ❌ Servidor de archivos

---

## 📱 Uso en Mobile (Flutter)

Para Flutter, necesitarás implementar un upload similar usando el paquete `http`:

```dart
// Ejemplo básico
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<String?> uploadToImgur(File imageFile) async {
  final bytes = await imageFile.readAsBytes();
  final base64Image = base64Encode(bytes);
  
  final response = await http.post(
    Uri.parse('https://api.imgur.com/3/image'),
    headers: {
      'Authorization': 'Client-ID YOUR_CLIENT_ID',
    },
    body: {'image': base64Image, 'type': 'base64'},
  );
  
  if (response.statusCode == 200) {
    final data = jsonDecode(response.body);
    return data['data']['link'];
  }
  return null;
}
```

---

## 🎉 ¡Listo!

Ahora puedes:

1. **Subir imágenes** desde la interfaz web
2. **Comprimir automáticamente** imágenes grandes
3. **Ver preview** antes de guardar
4. **Usar URLs externas** si prefieres

**Sin necesidad de Firebase Storage ni billing** 🚀

---

## 📞 Soporte

Si tienes problemas:

1. Revisa la consola del navegador (F12)
2. Verifica que el Client ID esté correcto
3. Asegúrate de tener conexión a internet
4. Revisa los límites de Imgur

Para más información: https://apidocs.imgur.com/
