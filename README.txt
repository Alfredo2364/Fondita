================================================================================
                        FONDITA - SISTEMA DE GESTIÓN
                    Sistema Integral para Restaurantes
================================================================================

DESCRIPCIÓN DEL PROYECTO
================================================================================

Fondita es un sistema completo de gestión para restaurantes que incluye:
- Aplicación Web (Next.js + Firebase)
- Aplicación Móvil (Flutter + Firebase)
- Sistema de autenticación por roles
- Gestión en tiempo real de mesas, órdenes, inventario y personal

El proyecto está diseñado para facilitar la operación diaria de un restaurante,
permitiendo a gerentes, meseros y personal de cocina trabajar de manera
coordinada y eficiente.

================================================================================
ARQUITECTURA DEL SISTEMA
================================================================================

PLATAFORMAS:
------------
1. WEB (Next.js 16.1.6)
   - Framework: Next.js con App Router
   - Lenguaje: TypeScript
   - Estilos: Tailwind CSS v4
   - Estado: Zustand
   - Base de datos: Firebase Firestore
   - Autenticación: Firebase Auth
   - Hosting: Vercel (recomendado)

2. MOBILE (Flutter)
   - Framework: Flutter
   - Lenguaje: Dart
   - Estado: Riverpod
   - Base de datos: Firebase Firestore
   - Autenticación: Firebase Auth
   - Plataformas: Android, iOS

BACKEND:
--------
- Firebase Firestore (Base de datos NoSQL en tiempo real)
- Firebase Authentication (Gestión de usuarios)
- Firebase Storage (Almacenamiento de imágenes)
- Firebase Admin SDK (Operaciones administrativas)

================================================================================
ROLES Y PERMISOS
================================================================================

1. ADMINISTRADOR (Manager/Jefe)
   - Acceso completo al sistema
   - Gestión de menú y categorías
   - Gestión de mesas
   - Gestión de empleados
   - Reportes y estadísticas
   - Control de inventario
   - Registro de gastos
   - Generación de códigos QR

2. PERSONAL (Staff/Mesero)
   - Gestión de órdenes
   - Asignación de mesas
   - Registro de asistencia
   - Escaneo de códigos QR
   - Visualización de mesas disponibles

3. COCINA (Kitchen)
   - Visualización de órdenes pendientes
   - Actualización de estado de platillos
   - Gestión de preparación de alimentos

================================================================================
FUNCIONALIDADES PRINCIPALES
================================================================================

GESTIÓN DE MESAS:
-----------------
✓ Registro y configuración de mesas
✓ Estados: Disponible, Ocupada, Reservada
✓ Asignación de capacidad
✓ Códigos QR por mesa
✓ Visualización en tiempo real

GESTIÓN DE MENÚ:
----------------
✓ Categorías de platillos
✓ Registro de platillos con imagen
✓ Precios y descripciones
✓ Control de disponibilidad
✓ Gestión de ingredientes

SISTEMA DE ÓRDENES:
-------------------
✓ Creación de órdenes por mesa
✓ Selección de platillos
✓ Cálculo automático de totales
✓ Estados: Pendiente, Cocinando, Listo, Entregado
✓ Sincronización en tiempo real con cocina

INVENTARIO:
-----------
✓ Registro de productos
✓ Control de stock
✓ Alertas de stock bajo
✓ Categorización de productos
✓ Unidades de medida

CONTROL DE GASTOS:
------------------
✓ Registro de gastos operativos
✓ Categorización de gastos
✓ Fechas y montos
✓ Reportes de gastos

GESTIÓN DE EMPLEADOS:
---------------------
✓ Registro de personal
✓ Asignación de roles
✓ Control de asistencia (check-in/check-out)
✓ Historial de asistencia
✓ Gestión de turnos

REPORTES:
---------
✓ Ventas diarias/mensuales
✓ Platillos más vendidos
✓ Análisis de inventario
✓ Reporte de gastos
✓ Ganancias netas

INTERNACIONALIZACIÓN:
---------------------
✓ Español (predeterminado)
✓ Inglés
✓ Cambio dinámico de idioma
✓ Persistencia de preferencia

TEMAS:
------
✓ Tema Claro (paleta cálida de restaurante)
✓ Tema Oscuro (paleta oscura profesional)
✓ Cambio dinámico
✓ Persistencia de preferencia

================================================================================
ESTRUCTURA DEL PROYECTO
================================================================================

Fondita/
├── web/                          # Aplicación Web (Next.js)
│   ├── src/
│   │   ├── app/                  # Páginas y rutas
│   │   │   ├── dashboard/        # Panel principal
│   │   │   │   ├── menu/         # Gestión de menú
│   │   │   │   ├── tables/       # Gestión de mesas
│   │   │   │   ├── orders/       # Gestión de órdenes
│   │   │   │   ├── inventory/    # Gestión de inventario
│   │   │   │   ├── expenses/     # Registro de gastos
│   │   │   │   ├── employees/    # Gestión de empleados
│   │   │   │   ├── reports/      # Reportes y estadísticas
│   │   │   │   └── settings/     # Configuración (tema/idioma)
│   │   │   └── login/            # Autenticación
│   │   ├── components/           # Componentes reutilizables
│   │   ├── lib/                  # Utilidades y Firebase
│   │   ├── store/                # Stores de Zustand
│   │   └── types/                # Tipos TypeScript
│   ├── public/                   # Archivos estáticos
│   └── package.json              # Dependencias
│
├── mobile/                       # Aplicación Móvil (Flutter)
│   ├── lib/
│   │   ├── core/                 # Configuración central
│   │   │   ├── i18n/             # Sistema de localización
│   │   │   ├── providers/        # Providers de Riverpod
│   │   │   ├── services/         # Servicios de Firebase
│   │   │   ├── theme/            # Temas y colores
│   │   │   └── models/           # Modelos de datos
│   │   ├── features/             # Funcionalidades principales
│   │   │   ├── auth/             # Autenticación
│   │   │   ├── home/             # Pantallas principales
│   │   │   └── table/            # Gestión de mesas
│   │   └── screens/              # Pantallas adicionales
│   │       ├── tables_screen.dart
│   │       ├── attendance_screen.dart
│   │       ├── kitchen_display_screen.dart
│   │       ├── qr_scanner_screen.dart
│   │       └── settings_screen.dart
│   ├── android/                  # Configuración Android
│   ├── ios/                      # Configuración iOS
│   └── pubspec.yaml              # Dependencias
│
└── README.txt                    # Este archivo

================================================================================
PALETA DE COLORES
================================================================================

TEMA CLARO:
-----------
Primary (Naranja):    #FF6B35  - Estimula el apetito y calidez
Secondary (Verde):    #4A7C59  - Frescura y naturalidad
Accent (Mostaza):     #F4A261  - Energía y dinamismo
Background:           #FFFBF5  - Crema muy claro
Card:                 #FFFFFF  - Blanco puro

Estados:
- Success (Verde):    #4CAF50
- Warning (Naranja):  #FFA726
- Error (Rojo):       #E53935
- Info (Azul):        #42A5F5

Mesas:
- Disponible:         #66BB6A  (Verde)
- Ocupada:            #EF5350  (Rojo)
- Reservada:          #FF9800  (Naranja)

Roles:
- Manager:            #7B2CBF  (Púrpura)
- Mesero:             #2196F3  (Azul)
- Cocina:             #FF5722  (Naranja fuego)

TEMA OSCURO:
------------
Primary:              #FF8A5B  (Naranja más claro)
Secondary:            #5F9B6D  (Verde más claro)
Accent:               #F7B77D  (Mostaza más claro)
Background:           #121212  (Negro suave)
Surface:              #1E1E1E  (Gris muy oscuro)
Card:                 #2C2C2C  (Gris oscuro)

================================================================================
TECNOLOGÍAS Y DEPENDENCIAS
================================================================================

WEB (Next.js):
--------------
- next: 16.1.6
- react: 19.2.3
- typescript: ^5
- tailwindcss: ^4
- firebase: ^12.9.0
- firebase-admin: ^13.6.1
- zustand: ^5.0.11
- framer-motion: ^12.34.0
- @heroicons/react: ^2.2.0
- qrcode.react: ^4.2.0
- react-to-print: ^3.2.0
- next-intl: ^3.26.2

MOBILE (Flutter):
-----------------
- flutter_localizations (SDK)
- firebase_core: ^3.3.0
- firebase_auth: ^5.1.4
- cloud_firestore: ^5.2.1
- firebase_storage: ^12.1.3
- flutter_riverpod: ^2.5.1
- mobile_scanner: ^5.2.3
- intl: any
- shared_preferences: ^2.2.2

================================================================================
INSTALACIÓN Y CONFIGURACIÓN
================================================================================

REQUISITOS PREVIOS:
-------------------
1. Node.js 20+ (para web)
2. Flutter SDK 3.0+ (para mobile)
3. Cuenta de Firebase
4. Android Studio / Xcode (para mobile)

CONFIGURACIÓN DE FIREBASE:
---------------------------
1. Crear proyecto en Firebase Console
2. Habilitar Authentication (Email/Password)
3. Crear base de datos Firestore
4. Habilitar Storage
5. Descargar archivos de configuración:
   - Web: firebase-config.ts
   - Android: google-services.json
   - iOS: GoogleService-Info.plist

INSTALACIÓN WEB:
----------------
1. cd web
2. npm install
3. Configurar Firebase en src/lib/firebase.ts
4. npm run dev (desarrollo)
5. npm run build (producción)

INSTALACIÓN MOBILE:
-------------------
1. cd mobile
2. flutter pub get
3. Configurar Firebase (seguir FlutterFire CLI)
4. flutter run (desarrollo)
5. flutter build apk/ios (producción)

================================================================================
ESTRUCTURA DE BASE DE DATOS (FIRESTORE)
================================================================================

COLECCIONES PRINCIPALES:
------------------------

users/
├── {userId}
│   ├── email: string
│   ├── name: string
│   ├── role: "admin" | "staff" | "kitchen"
│   └── createdAt: timestamp

categories/
├── {categoryId}
│   ├── name: string
│   ├── description: string
│   └── createdAt: timestamp

dishes/
├── {dishId}
│   ├── name: string
│   ├── description: string
│   ├── price: number
│   ├── categoryId: string
│   ├── imageUrl: string
│   ├── available: boolean
│   └── ingredients: array

tables/
├── {tableId}
│   ├── number: number
│   ├── capacity: number
│   ├── status: "available" | "occupied" | "reserved"
│   └── qrCode: string

orders/
├── {orderId}
│   ├── tableId: string
│   ├── items: array
│   ├── total: number
│   ├── status: "pending" | "cooking" | "ready" | "delivered"
│   ├── createdAt: timestamp
│   └── createdBy: string

inventory/
├── {productId}
│   ├── name: string
│   ├── category: string
│   ├── quantity: number
│   ├── unit: string
│   ├── minStock: number
│   └── lastUpdated: timestamp

expenses/
├── {expenseId}
│   ├── description: string
│   ├── amount: number
│   ├── category: string
│   ├── date: timestamp
│   └── createdBy: string

attendance/
├── {attendanceId}
│   ├── userId: string
│   ├── checkIn: timestamp
│   ├── checkOut: timestamp | null
│   └── date: string

================================================================================
FLUJOS DE TRABAJO PRINCIPALES
================================================================================

FLUJO DE ORDEN:
---------------
1. Mesero selecciona mesa disponible
2. Crea nueva orden
3. Agrega platillos del menú
4. Confirma orden
5. Orden aparece en pantalla de cocina (estado: Pendiente)
6. Cocina inicia preparación (estado: Cocinando)
7. Cocina marca como listo (estado: Listo)
8. Mesero entrega a cliente (estado: Entregado)
9. Se cierra la mesa y se actualiza inventario

FLUJO DE ASISTENCIA:
--------------------
1. Empleado hace check-in al iniciar turno
2. Sistema registra hora de entrada
3. Durante el turno, realiza sus funciones
4. Al finalizar, hace check-out
5. Sistema registra hora de salida
6. Se calcula tiempo trabajado

FLUJO DE INVENTARIO:
--------------------
1. Administrador registra productos
2. Define stock mínimo
3. Al crear órdenes, se descuenta inventario
4. Sistema alerta cuando stock < mínimo
5. Administrador reabastece y actualiza cantidades

================================================================================
CARACTERÍSTICAS DE SEGURIDAD
================================================================================

✓ Autenticación basada en Firebase Auth
✓ Reglas de seguridad en Firestore
✓ Validación de roles en frontend y backend
✓ Protección de rutas por rol
✓ Encriptación de datos en tránsito (HTTPS)
✓ Tokens de sesión seguros
✓ Validación de entrada de datos

================================================================================
CARACTERÍSTICAS IMPLEMENTADAS RECIENTEMENTE
================================================================================

INTERNACIONALIZACIÓN (i18n):
----------------------------
✓ Soporte para Español e Inglés
✓ Cambio dinámico de idioma sin reiniciar
✓ Persistencia de preferencia de idioma
✓ Traducciones completas en ambas plataformas
✓ Sistema escalable para agregar más idiomas

SISTEMA DE TEMAS:
-----------------
✓ Tema Claro con paleta cálida de restaurante
✓ Tema Oscuro con paleta profesional (#121212)
✓ Cambio dinámico entre temas
✓ Persistencia de preferencia de tema
✓ Transiciones suaves
✓ CSS variables en web
✓ Material 3 en mobile

PANTALLA DE CONFIGURACIÓN:
--------------------------
✓ Switch de tema (claro/oscuro)
✓ Selector de idioma (ES/EN)
✓ Vista previa de paleta de colores
✓ Acceso desde menú principal
✓ Guardado automático de preferencias

================================================================================
PRÓXIMAS FUNCIONALIDADES SUGERIDAS
================================================================================

□ Sistema de reservaciones online
□ Integración con pasarelas de pago
□ Notificaciones push
□ Programa de lealtad para clientes
□ Sistema de propinas digitales
□ Análisis predictivo de ventas
□ Integración con delivery (Uber Eats, Rappi)
□ Sistema de feedback de clientes
□ Gestión de proveedores
□ Facturación electrónica

================================================================================
SOLUCIÓN DE PROBLEMAS COMUNES
================================================================================

ERROR: "Firebase not initialized"
SOLUCIÓN: Verificar que firebase-config esté correctamente configurado

ERROR: "Permission denied" en Firestore
SOLUCIÓN: Revisar reglas de seguridad en Firebase Console

ERROR: "Build failed" en Flutter
SOLUCIÓN: Ejecutar flutter clean && flutter pub get

ERROR: Tema no cambia en web
SOLUCIÓN: Verificar que ThemeProvider esté en layout.tsx

ERROR: Traducciones no aparecen
SOLUCIÓN: Verificar que el idioma esté en supportedLocales

================================================================================
CONTACTO Y SOPORTE
================================================================================

Proyecto desarrollado para: Universidad Tecnológica Metropolitana
Curso: Programación Web y Móvil - Quinto Cuatrimestre

Para soporte técnico o consultas sobre el proyecto, contactar al equipo
de desarrollo.

================================================================================
LICENCIA
================================================================================

Este proyecto es de uso académico y está protegido por derechos de autor.
No se permite su distribución comercial sin autorización previa.

================================================================================
ÚLTIMA ACTUALIZACIÓN
================================================================================

Fecha: 16 de Febrero de 2026
Versión: 2.0.0
Estado: Producción

Cambios recientes:
- Implementación completa de i18n (ES/EN)
- Sistema de temas claro/oscuro
- Pantalla de configuración
- Paleta de colores profesional
- Integración en web y mobile

================================================================================
                            FIN DE LA DOCUMENTACIÓN
================================================================================
