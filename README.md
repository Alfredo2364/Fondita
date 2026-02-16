# Fondita - Sistema de Gestión para Restaurantes

<div align="center">

![Fondita Logo](web/public/favicon.svg)

**Sistema integral de gestión para restaurantes con aplicaciones web y móvil**

[![Version](https://img.shields.io/badge/version-3.0.0-orange.svg)](https://github.com/tuusuario/fondita)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.0+-blue)](https://flutter.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.9.0-orange)](https://firebase.google.com/)

[Demo](https://tuusuario.github.io/fondita/) · [Documentación](README.txt) · [Reportar Bug](https://github.com/tuusuario/fondita/issues)

</div>

---

## 🌟 Características

- 🪑 **Gestión de Mesas** - Control en tiempo real de disponibilidad y reservaciones
- 📋 **Sistema de Órdenes** - Toma y gestión eficiente de pedidos
- 📦 **Control de Inventario** - Monitoreo de stock y alertas automáticas
- 👥 **Gestión de Personal** - Administración de empleados y asistencia
- 📊 **Reportes y Analíticas** - Visualización de ventas y métricas clave
- 📱 **Multi-Plataforma** - Web y móvil (Android/iOS) con sincronización en tiempo real
- 🌍 **Multiidioma** - Español e Inglés
- 🌙 **Tema Oscuro** - Modo claro y oscuro

## 🚀 Demo

- **Landing Page**: [https://tuusuario.github.io/fondita/](https://tuusuario.github.io/fondita/)
- **Dashboard**: [https://tuusuario.github.io/fondita/dashboard](https://tuusuario.github.io/fondita/dashboard)

## 📸 Screenshots

![Dashboard](docs/screenshots/dashboard.png)
![Mobile App](docs/screenshots/mobile.png)

## 🛠️ Tecnologías

### Web
- **Framework**: Next.js 16.1.6
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Estado**: Zustand
- **UI**: Framer Motion, Heroicons

### Mobile
- **Framework**: Flutter
- **Lenguaje**: Dart
- **Estado**: Riverpod
- **QR**: Mobile Scanner

### Backend
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Storage**: Firebase Storage
- **Hosting**: Firebase Hosting / GitHub Pages

## 📦 Instalación

### Requisitos Previos

- Node.js 20+
- Flutter SDK 3.0+
- Firebase CLI
- Cuenta de Firebase

### Web

```bash
cd web
npm install
cp .env.example .env.local
# Configurar variables de Firebase en .env.local
npm run dev
```

### Mobile

```bash
cd mobile
flutter pub get
flutterfire configure
flutter run
```

## 🔧 Configuración

### Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication (Email/Password)
3. Crear base de datos Firestore
4. Habilitar Storage
5. Configurar variables de entorno

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para instrucciones detalladas.

## 📚 Documentación

- [README.txt](README.txt) - Documentación completa
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guía de despliegue
- [CHANGELOG.md](CHANGELOG.md) - Historial de cambios
- [CONTRIBUTING.md](CONTRIBUTING.md) - Guía de contribución

## 🚢 Deployment

### Firebase Hosting

```bash
cd web
npm run deploy:firebase
```

### GitHub Pages

```bash
git push origin main
# GitHub Actions se encarga del deploy automático
```

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para más opciones.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para detalles.

## 📄 Licencia

Este proyecto es de uso académico. Ver [LICENSE](LICENSE) para más información.

## 👥 Autores

- **Fondita Team** - Universidad Tecnológica Metropolitana

## 🙏 Agradecimientos

- Firebase por el backend
- Next.js por el framework web
- Flutter por el framework móvil
- Comunidad open source

---

<div align="center">

**[⬆ Volver arriba](#fondita---sistema-de-gestión-para-restaurantes)**

Hecho con ❤️ por el equipo de Fondita

</div>
