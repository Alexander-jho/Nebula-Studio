# Nebula Studio - Profesional Unlimited Design Suite

Una alternativa revolucionaria a Canva y Figma, impulsada por IA y construida para ser 100% gratuita y profesional.

## Características
- **Diseño Gráfico**: Editor vectorial basado en Fabric.js.
- **IA Generativa**: Generación ilimitada de imágenes y logos usando Gemini 3 Flash.
- **Multicanvas**: Plantillas para Instagram, YouTube, Presentaciones, etc.
- **Exportación HD**: Descarga tus diseños en PNG sin marcas de agua.
- **Firebase Auth**: Autenticación segura con Google Login.
- **SaaS Ready**: Arquitectura Full-Stack lista para escalar.

## Despliegue Local (Fuera de AI Studio)

### 1. Requisitos
- Node.js 18+ instalado.
- Un proyecto en [Firebase Console](https://console.firebase.google.com/).
- Una clave de API de [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Configuración
1. Clona el repositorio o descarga el código.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura tus variables de entorno:
   - Copia `.env.example` a `.env`.
   - Añade tu `GEMINI_API_KEY`.
4. Configura Firebase:
   - Crea un archivo `firebase-applet-config.json` en la raíz con tus credenciales de Firebase:
     ```json
     {
       "apiKey": "TU_API_KEY",
       "authDomain": "TU_PROYECTO.firebaseapp.com",
       "projectId": "TU_PROYECTO",
       "storageBucket": "TU_PROYECTO.appspot.com",
       "messagingSenderId": "...",
       "appId": "...",
       "firestoreDatabaseId": "(default)"
     }
     ```

### 3. Ejecución
Para desarrollo con recarga en vivo:
```bash
npm run dev
```

Para construcción de producción:
```bash
npm run build
npm start
```

## Estructura del Proyecto
- `/src/components`: UI modular con Tailwind CSS y Framer Motion.
- `/src/lib`: Integración con Firebase.
- `/server.ts`: Servidor backend Express con proxy para Gemini AI.
- `firestore.rules`: Reglas de seguridad profesionales para producción.

## Créditos
Desarrollado con ❤️ por Nebula Team.
