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

## Troubleshooting

### "Error al iniciar sesión" (Login Failed)
Si recibes un error al intentar iniciar sesión:
1. **Dominios Autorizados**: Asegúrate de que el dominio donde estás ejecutando la app (ej. `localhost` o tu URL de despliegue) esté en la lista de **Dominios Autorizados** en la Firebase Console > Authentication > Settings.
2. **Método de Inicio de Sesión**: Asegúrate de que **Google** esté habilitado como proveedor en Firebase Console > Authentication > Sign-in method.
3. **Bloqueo de Popups**: Algunos navegadores bloquean las ventanas emergentes. Asegúrate de permitir popups para el sitio.

### Errores de Permisos (Firestore)
Si no puedes guardar o crear proyectos, asegúrate de haber desplegado las reglas de seguridad:
```bash
# Si tienes firebase-tools instalado
firebase deploy --only firestore:rules
```
O copia el contenido de `firestore.rules` y pégalo directamente en la sección de "Rules" de Firestore en tu consola de Firebase.
