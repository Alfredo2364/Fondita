# Guía de Despliegue - Fondita

## Opciones de Despliegue

Fondita puede desplegarse en múltiples plataformas. A continuación se detallan las opciones recomendadas.

---

## 1. Firebase Hosting (Recomendado)

### Ventajas
- Integración nativa con Firebase
- CDN global automático
- SSL gratuito
- Despliegue en un comando

### Pasos

1. **Instalar Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login a Firebase**
```bash
firebase login
```

3. **Inicializar proyecto (si no está hecho)**
```bash
firebase init hosting
# Seleccionar:
# - Public directory: out
# - Configure as single-page app: Yes
# - Set up automatic builds with GitHub: No (opcional)
```

4. **Build del proyecto**
```bash
cd web
npm run build
```

5. **Deploy**
```bash
firebase deploy --only hosting
```

### URL de acceso
Tu app estará disponible en: `https://TU-PROJECT-ID.web.app`

---

## 2. GitHub Pages

### Ventajas
- Hosting gratuito
- Dominio personalizado disponible
- Integración con GitHub Actions

### Configuración

1. **Habilitar GitHub Pages**
   - Ve a Settings → Pages
   - Source: GitHub Actions

2. **Configurar Secrets**
   En Settings → Secrets → Actions, agregar:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

3. **Push a main/master**
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

4. **Workflow automático**
El archivo `.github/workflows/deploy.yml` se ejecutará automáticamente.

### URL de acceso
`https://TU-USUARIO.github.io/fondita/`

### Dominio personalizado
1. Agregar archivo `CNAME` en `/web/public/` con tu dominio
2. Configurar DNS en tu proveedor:
   - Tipo A: 185.199.108.153
   - Tipo A: 185.199.109.153
   - Tipo A: 185.199.110.153
   - Tipo A: 185.199.111.153

---

## 3. Vercel (Alternativa)

### Ventajas
- Optimizado para Next.js
- Preview deployments automáticos
- Analytics incluido

### Pasos

1. **Instalar Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
cd web
vercel
```

3. **Configurar variables de entorno**
En el dashboard de Vercel, agregar las variables de Firebase.

---

## 4. Netlify (Alternativa)

### Pasos

1. **Instalar Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build**
```bash
cd web
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod --dir=out
```

---

## Mobile (Flutter)

### Android

1. **Build APK**
```bash
cd mobile
flutter build apk --release
```

APK en: `mobile/build/app/outputs/flutter-apk/app-release.apk`

2. **Build App Bundle (Google Play)**
```bash
flutter build appbundle --release
```

Bundle en: `mobile/build/app/outputs/bundle/release/app-release.aab`

### iOS

1. **Build**
```bash
flutter build ios --release
```

2. **Abrir en Xcode**
```bash
open ios/Runner.xcworkspace
```

3. **Archive y subir a App Store**

---

## Configuración de Firebase

### Reglas de Seguridad

Después del primer deploy, aplicar reglas:

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### Índices de Firestore

```bash
firebase deploy --only firestore:indexes
```

---

## Variables de Entorno

### Web (.env.local)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Mobile
Configurar con FlutterFire CLI:
```bash
flutterfire configure
```

---

## Checklist Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] Firebase project creado
- [ ] Authentication habilitado
- [ ] Firestore database creado
- [ ] Storage habilitado
- [ ] Reglas de seguridad aplicadas
- [ ] Build exitoso localmente
- [ ] Tests pasando
- [ ] README actualizado

---

## Troubleshooting

### Error: "Firebase not initialized"
- Verificar variables de entorno
- Verificar firebase-config.ts

### Error: "Permission denied"
- Revisar firestore.rules
- Verificar rol de usuario

### Build falla en GitHub Actions
- Verificar secrets configurados
- Revisar logs de workflow

### App no carga en GitHub Pages
- Verificar basePath en next.config.ts
- Verificar output: 'export' en next.config.ts

---

## Monitoreo Post-Deploy

1. **Firebase Console**
   - Authentication: Usuarios activos
   - Firestore: Uso de base de datos
   - Storage: Archivos subidos
   - Hosting: Tráfico

2. **Analytics**
   - Google Analytics (opcional)
   - Firebase Analytics

3. **Logs**
   - Firebase Functions logs
   - Browser console errors

---

## Actualizaciones

### Web
```bash
cd web
git pull
npm install
npm run build
firebase deploy --only hosting
```

### Mobile
```bash
cd mobile
git pull
flutter pub get
flutter build apk --release
```

---

## Soporte

Para problemas de deployment:
1. Revisar logs de Firebase/GitHub Actions
2. Consultar documentación oficial
3. Verificar configuración de DNS (si aplica)
