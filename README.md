# DeepSaffix - Cliente Electron + React + Vite

Este proyecto utiliza **Electron**, **React**, **TypeScript** y **Vite** para crear una aplicación de escritorio multiplataforma.

## Estructura del Proyecto

```
deepsaffix-cliente/
├── electron/                    # Código del proceso principal de Electron
│   ├── main.ts                 # Punto de entrada principal de Electron
│   └── preload.ts              # Scripts de pre-carga (opcional)
├── src/                        # Aplicación React
├── dist-electron/              # Código compilado de Electron (generado)
├── dist/                       # Build de React (generado)
├── index.html                  # Punto de entrada HTML
├── vite.config.ts              # Configuración de Vite
├── tsconfig.electron.json      # Configuración TypeScript para Electron
├── tsconfig.json               # Configuración TypeScript para React
└── package.json                # Dependencias y scripts
```

## Prerrequisitos

- **Node.js** (v16 o superior)
- **npm** (v8 o superior)
- **Git**

## Configuración Inicial

### 1. Clonar el repositorio
```bash
git clone [<url-del-repositorio>](https://github.com/Grupo-2-DPM/DeepSaffix-CLIENTE.git)
cd deepsaffix-cliente
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Instalar dependencias de desarrollo
```bash
npm install --save-dev electron typescript @types/node @types/electron
npm install --save-dev concurrently wait-on
```

## Scripts Disponibles

### Desarrollo
```bash
# Iniciar servidor de desarrollo Vite + Electron
npm run dev:all

# O ejecutar por separado:
npm run dev          # Iniciar solo Vite
npm run electron     # Iniciar solo Electron (después de Vite)
```

### Build y Producción
```bash
# Build para producción
npm run build          # Build de React
npm run build:electron # Build de Electron

# Ejecutar en modo producción
npm run start
```

## Configuración Técnica

### Archivos de Configuración Clave

#### **1. `tsconfig.electron.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "outDir": "./dist-electron",
    "rootDir": "./electron",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true
  }
}
```

#### **2. `package.json` - Scripts**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "build:electron": "tsc -p tsconfig.electron.json",
    "electron": "electron . --no-sandbox",
    "dev:electron": "concurrently -k \"npm run dev\" \"npm run build:electron && wait-on tcp:5173 && npm run electron\"",
    "dev:all": "npm run dev:electron"
  },
}
```

#### **3. `electron/main.ts`** (Ejemplo básico)
```typescript
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadURL('http://localhost:5173');
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);
```

## Solución de Problemas Comunes

### 1. **Error de sandbox en Linux**
```
FATAL:sandbox/linux/suid/client/setuid_sandbox_host.cc:166]
```

**Solución:** Ejecutar con `--no-sandbox` o configurar permisos:
```bash
# Opción A: Añadir flag (recomendado para desarrollo)
electron . --no-sandbox

# Opción B: Configurar permisos (Linux)
sudo chown root node_modules/electron/dist/chrome-sandbox
sudo chmod 4755 node_modules/electron/dist/chrome-sandbox
```

### 2. **Error: `__dirname is not defined`**
**Causa:** Uso de módulos ES sin configuración adecuada.

**Solución:** Usar `import.meta.url` en TypeScript:
```typescript
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

### 3. **Electron no se conecta a Vite**
**Solución:** Verificar que:
1. Vite esté corriendo en puerto 5173
2. Añadir timeout en `main.ts`:
```typescript
setTimeout(() => {
  mainWindow.loadURL('http://localhost:5173');
}, 3000);
```

### 4. **Errores de TypeScript**
**Solución:** Asegurar configuración correcta:
```json
{
  "compilerOptions": {
    "module": "ESNext"  // Necesario para import.meta
  }
}
```

## Empaquetado para Producción

### 1. Instalar electron-builder
```bash
npm install --save-dev electron-builder
```

### 2. Configurar scripts de build
```json
{
  "scripts": {
    "dist": "electron-builder",
    "dist:linux": "electron-builder --linux",
    "dist:win": "electron-builder --win",
    "dist:mac": "electron-builder --mac"
  }
}
```

### 3. Configurar electron-builder en `package.json`
```json
{
  "build": {
    "appId": "com.deepsaffix.app",
    "productName": "DeepSaffix",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "dist-electron/**/*",
      "node_modules/**/*"
    ],
    "linux": {
      "target": ["AppImage", "deb"]
    }
  }
}
```

## Configuración de Desarrollo

### Hot Reload para Electron
Instalar `electron-reloader`:
```bash
npm install --save-dev electron-reloader
```

Añadir en `main.ts`:
```typescript
try {
  require('electron-reloader')(module, {
    debug: true,
    watchRenderer: true
  });
} catch {}
```

### Configurar alias en Vite
```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});
```

## Comunicación entre Procesos

### 1. **Preload Script** (`electron/preload.ts`)
```typescript
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('api', {
  platform: process.platform,
  nodeVersion: process.version
});
```

### 2. **Enviar mensajes desde Renderer**
```typescript
// En tu componente React
const handleMessage = () => {
  if (window.api) {
    console.log(window.api.platform);
  }
};
```

## Testing

### Pruebas unitarias
```bash
# Instalar dependencias
npm install --save-dev jest @testing-library/react

# Ejecutar tests
npm test
```

### Configuración de Jest
```json
{
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/src/setupTests.ts"]
  }
}
```

## Recursos Adicionales

- [Documentación oficial de Electron](https://www.electronjs.org/docs)
- [Guía de Electron con Vite](https://www.electronjs.org/docs/latest/tutorial/tutorial-vite)
- [Electron + React + TypeScript](https://www.electronforge.io/guides/framework-integration/react-with-typescript)
- [Vite Documentation](https://vitejs.dev/guide/)

## Contribución

1. Fork del repositorio
2. Crear rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

---

**Nota**: Este documento se actualiza regularmente. Para sugerencias o correcciones, por favor abre un issue o pull request.