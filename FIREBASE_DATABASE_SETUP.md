# 🔥 Guía Completa: Configurar Firebase para Fondita

Esta guía te llevará paso a paso para configurar completamente Firebase Firestore para el proyecto Fondita.

---

## 📋 Tabla de Contenidos

1. [Crear Proyecto Firebase](#1-crear-proyecto-firebase)_
2. [Configurar Firestore Database](#2-configurar-firestore-database)
3. [Configurar Authentication](#3-configurar-authentication)
4. [Crear Estructura de Base de Datos](#4-crear-estructura-de-base-de-datos)
5. [Configurar Reglas de Seguridad](#5-configurar-reglas-de-seguridad)
6. [Crear Índices](#6-crear-índices)
7. [Agregar Datos de Prueba](#7-agregar-datos-de-prueba)
8. [Obtener Credenciales](#8-obtener-credenciales)
9. [Verificación Final](#9-verificación-final)

---

## 1. Crear Proyecto Firebase

### Paso 1.1: Ir a Firebase Console
1. Abre https://console.firebase.google.com/
2. Click en **"Agregar proyecto"** o **"Add project"**

### Paso 1.2: Configurar Proyecto
1. **Nombre del proyecto**: `Fondita` (o el nombre que prefieras)
2. Click **"Continuar"**
3. **Google Analytics**: Puedes desactivarlo (opcional)
4. Click **"Crear proyecto"**
5. Espera a que se cree (30-60 segundos)
6. Click **"Continuar"**

✅ **Proyecto creado exitosamente**

---

## 2. Configurar Firestore Database

### Paso 2.1: Crear Base de Datos
1. En el menú lateral, click en **"Firestore Database"**
2. Click en **"Crear base de datos"** o **"Create database"**

### Paso 2.2: Modo de Seguridad
Selecciona: **"Iniciar en modo de prueba"** o **"Start in test mode"**
- Esto permite acceso temporal (30 días)
- Configuraremos reglas de seguridad después

### Paso 2.3: Ubicación
Selecciona la ubicación más cercana:
- **us-central1** (Iowa, USA) - Recomendado para México
- **southamerica-east1** (São Paulo, Brasil)

Click **"Habilitar"** o **"Enable"**

✅ **Firestore Database creado**

---

## 3. Configurar Authentication

### Paso 3.1: Habilitar Authentication
1. En el menú lateral, click en **"Authentication"**
2. Click en **"Comenzar"** o **"Get started"**

### Paso 3.2: Habilitar Email/Password
1. Click en la pestaña **"Sign-in method"**
2. Click en **"Email/Password"**
3. **Habilitar** el primer switch (Email/Password)
4. Click **"Guardar"** o **"Save"**

✅ **Authentication configurado**

---

## 4. Crear Estructura de Base de Datos

Ahora vamos a crear todas las colecciones necesarias en Firestore.

### Paso 4.1: Crear Colección "users"

1. En **Firestore Database**, click **"Iniciar colección"**
2. **ID de colección**: `users`
3. Click **"Siguiente"**

**Primer documento (Usuario Admin):**
- **ID del documento**: `admin-user-001` (o auto-generado)
- Agregar campos:

| Campo | Tipo | Valor |
|-------|------|-------|
| `email` | string | `admin@fondita.com` |
| `name` | string | `Administrador` |
| `role` | string | `admin` |
| `createdAt` | timestamp | (Click en reloj para fecha actual) |
| `active` | boolean | `true` |

4. Click **"Guardar"**

### Paso 4.2: Crear Colección "categories"

1. Click **"Iniciar colección"**
2. **ID de colección**: `categories`
3. Click **"Siguiente"**

**Primer documento (Platillos Principales):**

| Campo | Tipo | Valor |
|-------|------|-------|
| `name` | string | `Platillos Principales` |
| `description` | string | `Nuestros platillos más populares` |
| `icon` | string | `🍽️` |
| `order` | number | `1` |
| `active` | boolean | `true` |

4. Click **"Guardar"**
5. **IMPORTANTE**: Copia el ID generado (lo necesitarás después)

**Segundo documento (Bebidas):**

1. Click **"Agregar documento"**
2. Agregar campos:

| Campo | Tipo | Valor |
|-------|------|-------|
| `name` | string | `Bebidas` |
| `description` | string | `Refrescantes bebidas` |
| `icon` | string | `🥤` |
| `order` | number | `2` |
| `active` | boolean | `true` |

3. Click **"Guardar"**

### Paso 4.3: Crear Colección "dishes"

1. Click **"Iniciar colección"**
2. **ID de colección**: `dishes`
3. Click **"Siguiente"**

**Primer documento (Platillo de ejemplo):**

| Campo | Tipo | Valor |
|-------|------|-------|
| `name` | string | `Tacos al Pastor` |
| `description` | string | `3 tacos con carne al pastor, piña y cilantro` |
| `price` | number | `75` |
| `categoryId` | string | `PEGAR_ID_DE_CATEGORIA_AQUI` |
| `imageUrl` | string | `https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400` |
| `available` | boolean | `true` |
| `ingredients` | array | `["Tortilla", "Carne al pastor", "Piña", "Cilantro"]` |
| `preparationTime` | number | `15` |
| `createdAt` | timestamp | (Fecha actual) |

**IMPORTANTE**: En `categoryId`, pega el ID que copiaste de la categoría "Platillos Principales"

4. Click **"Guardar"**

### Paso 4.4: Crear Colección "tables"

1. Click **"Iniciar colección"**
2. **ID de colección**: `tables`
3. Click **"Siguiente"**

**Primer documento (Mesa 1):**

| Campo | Tipo | Valor |
|-------|------|-------|
| `number` | number | `1` |
| `capacity` | number | `4` |
| `status` | string | `available` |
| `location` | string | `Terraza` |

4. Click **"Guardar"**

**Agregar más mesas:**
Repite para Mesa 2, 3, 4, etc.

### Paso 4.5: Crear Colección "orders"

1. Click **"Iniciar colección"**
2. **ID de colección**: `orders`
3. Click **"Siguiente"**

**Primer documento (Orden de ejemplo):**

| Campo | Tipo | Valor |
|-------|------|-------|
| `tableId` | string | `ID_DE_MESA_1` |
| `status` | string | `pending` |
| `items` | array | (Dejar vacío por ahora) |
| `total` | number | `0` |
| `createdAt` | timestamp | (Fecha actual) |
| `createdBy` | string | `admin@fondita.com` |

4. Click **"Guardar"**

### Paso 4.6: Crear Colección "inventory"

1. Click **"Iniciar colección"**
2. **ID de colección**: `inventory`
3. Click **"Siguiente"**

**Primer documento (Producto de ejemplo):**

| Campo | Tipo | Valor |
|-------|------|-------|
| `name` | string | `Tomates` |
| `category` | string | `Verduras` |
| `quantity` | number | `50` |
| `unit` | string | `kg` |
| `minStock` | number | `10` |
| `price` | number | `25` |
| `supplier` | string | `Verduras Frescas SA` |
| `lastUpdated` | timestamp | (Fecha actual) |

4. Click **"Guardar"**

✅ **Estructura de base de datos creada**

---

## 5. Configurar Reglas de Seguridad

### Paso 5.1: Abrir Reglas
1. En **Firestore Database**, click en la pestaña **"Reglas"**

### Paso 5.2: Reemplazar Reglas

Borra todo el contenido y pega esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función helper para verificar autenticación
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Función helper para obtener datos del usuario
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    // Función helper para verificar rol
    function hasRole(role) {
      return isSignedIn() && getUserData().role == role;
    }
    
    // Función helper para verificar si es admin
    function isAdmin() {
      return hasRole('admin');
    }
    
    // Función helper para verificar si es staff o admin
    function isStaffOrAdmin() {
      return hasRole('admin') || hasRole('staff');
    }
    
    // Colección: users
    match /users/{userId} {
      // Leer: solo el propio usuario o admin
      allow read: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      // Crear: solo admin
      allow create: if isAdmin();
      // Actualizar: solo el propio usuario (campos limitados) o admin
      allow update: if isSignedIn() && (
        (request.auth.uid == userId && 
         !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'email'])) 
        || isAdmin()
      );
      // Eliminar: solo admin
      allow delete: if isAdmin();
    }
    
    // Colección: categories
    match /categories/{categoryId} {
      // Leer: cualquier usuario autenticado
      allow read: if isSignedIn();
      // Escribir: solo admin
      allow write: if isAdmin();
    }
    
    // Colección: dishes
    match /dishes/{dishId} {
      // Leer: cualquier usuario autenticado
      allow read: if isSignedIn();
      // Escribir: solo admin o staff
      allow write: if isStaffOrAdmin();
    }
    
    // Colección: tables
    match /tables/{tableId} {
      // Leer: cualquier usuario autenticado
      allow read: if isSignedIn();
      // Escribir: solo admin o staff
      allow write: if isStaffOrAdmin();
    }
    
    // Colección: orders
    match /orders/{orderId} {
      // Leer: cualquier usuario autenticado
      allow read: if isSignedIn();
      // Crear: staff o admin
      allow create: if isStaffOrAdmin();
      // Actualizar: staff o admin
      allow update: if isStaffOrAdmin();
      // Eliminar: solo admin
      allow delete: if isAdmin();
    }
    
    // Colección: inventory
    match /inventory/{itemId} {
      // Leer: cualquier usuario autenticado
      allow read: if isSignedIn();
      // Escribir: solo admin
      allow write: if isAdmin();
    }
    
    // Colección: settings (configuración general)
    match /settings/{settingId} {
      // Leer: cualquier usuario autenticado
      allow read: if isSignedIn();
      // Escribir: solo admin
      allow write: if isAdmin();
    }
  }
}
```

3. Click **"Publicar"** o **"Publish"**

✅ **Reglas de seguridad configuradas**

---

## 6. Crear Índices

### Paso 6.1: Abrir Índices
1. En **Firestore Database**, click en la pestaña **"Índices"**

### Paso 6.2: Crear Índices Compuestos

**Índice 1: Orders por mesa y fecha**
1. Click **"Agregar índice"**
2. **Colección**: `orders`
3. Agregar campos:
   - `tableId` - Ascendente
   - `createdAt` - Descendente
4. **Estado de consulta**: Habilitado
5. Click **"Crear"**

**Índice 2: Dishes por categoría y disponibilidad**
1. Click **"Agregar índice"**
2. **Colección**: `dishes`
3. Agregar campos:
   - `categoryId` - Ascendente
   - `available` - Ascendente
   - `name` - Ascendente
4. Click **"Crear"**

**Índice 3: Inventory por stock bajo**
1. Click **"Agregar índice"**
2. **Colección**: `inventory`
3. Agregar campos:
   - `quantity` - Ascendente
   - `minStock` - Ascendente
4. Click **"Crear"**

✅ **Índices creados** (pueden tardar unos minutos en estar listos)

---

## 7. Agregar Datos de Prueba

### Opción A: Usar el archivo DATOS_DE_PRUEBA.md

1. Abre el archivo `DATOS_DE_PRUEBA.md` en el proyecto
2. Copia los datos JSON de cada sección
3. Pégalos en Firestore como nuevos documentos

### Opción B: Importar desde consola

Puedes agregar más datos manualmente siguiendo la estructura de las secciones anteriores.

**Datos recomendados para pruebas:**
- ✅ 2-3 categorías
- ✅ 5-10 platillos
- ✅ 5-10 mesas
- ✅ 2-3 órdenes de ejemplo
- ✅ 10-15 productos de inventario

---

## 8. Obtener Credenciales

### Paso 8.1: Credenciales Web

1. En la página principal de Firebase, click en el ícono **Web** (`</>`)
2. **Nombre de la app**: `Fondita Web`
3. Click **"Registrar app"**
4. **Copiar** el objeto de configuración:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "fondita-xxxxx.firebaseapp.com",
  projectId: "fondita-xxxxx",
  storageBucket: "fondita-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

5. Click **"Continuar a la consola"**

### Paso 8.2: Configurar en Web

1. Abre `/web/.env.local`
2. Agrega las credenciales:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fondita-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fondita-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fondita-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Paso 8.3: Configurar en Mobile

1. **Para Android**:
   ```bash
   cd mobile
   flutterfire configure
   ```
   - Selecciona el proyecto `Fondita`
   - Selecciona plataformas: Android, iOS
   - Esto creará automáticamente los archivos de configuración

2. **Verificar archivos creados**:
   - `mobile/lib/firebase_options.dart` ✅
   - `mobile/android/app/google-services.json` ✅
   - `mobile/ios/Runner/GoogleService-Info.plist` ✅

---

## 9. Verificación Final

### Paso 9.1: Crear Usuario Admin en Authentication

1. Ve a **Authentication** → **Users**
2. Click **"Agregar usuario"**
3. **Email**: `admin@fondita.com`
4. **Contraseña**: `Admin123!` (o la que prefieras)
5. Click **"Agregar usuario"**
6. **COPIAR** el UID generado

### Paso 9.2: Vincular Usuario con Firestore

1. Ve a **Firestore Database** → Colección `users`
2. Encuentra el documento del admin que creaste antes
3. Click en el documento
4. Click en el ícono de **tres puntos** → **Cambiar ID de documento**
5. Pega el **UID** que copiaste de Authentication
6. Click **"Guardar"**

### Paso 9.3: Verificar Conexión

**Web:**
```bash
cd web
npm run dev
```
- Abre http://localhost:3000
- Intenta hacer login con `admin@fondita.com`
- Deberías poder acceder al dashboard

**Mobile:**
```bash
cd mobile
flutter run
```
- Intenta hacer login con `admin@fondita.com`
- Deberías poder acceder a la app

---

## ✅ Checklist Final

- [ ] Proyecto Firebase creado
- [ ] Firestore Database habilitado
- [ ] Authentication configurado (Email/Password)
- [ ] Colecciones creadas:
  - [ ] users
  - [ ] categories
  - [ ] dishes
  - [ ] tables
  - [ ] orders
  - [ ] inventory
- [ ] Reglas de seguridad configuradas
- [ ] Índices creados
- [ ] Datos de prueba agregados
- [ ] Credenciales obtenidas
- [ ] `.env.local` configurado (web)
- [ ] `flutterfire configure` ejecutado (mobile)
- [ ] Usuario admin creado en Authentication
- [ ] Usuario admin vinculado en Firestore
- [ ] Login probado en web
- [ ] Login probado en mobile

---

## 🎉 ¡Firebase Completamente Configurado!

Ahora tienes:
- ✅ Base de datos Firestore funcional
- ✅ Authentication configurado
- ✅ Reglas de seguridad implementadas
- ✅ Índices para consultas rápidas
- ✅ Datos de prueba listos
- ✅ Credenciales configuradas en web y mobile
- ✅ Usuario admin listo para usar

**Siguiente paso:** ¡Empezar a usar la aplicación! 🚀

---

## 📞 Soporte

Si tienes problemas:
- Revisa la consola de Firebase para errores
- Verifica que las reglas de seguridad estén publicadas
- Asegúrate de que el UID del usuario coincida en Authentication y Firestore
- Revisa los logs de la aplicación (consola del navegador o terminal)

**Documentación oficial:** https://firebase.google.com/docs
