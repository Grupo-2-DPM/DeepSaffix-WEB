# DeepSaffix - WEB TypeScript + React + Vite

Este proyecto utiliza **TypeScript**, **React** y **Vite** para crear una aplicación de escritorio multiplataforma.

## Estructura del Proyecto

```
deepsaffix-wen/
├── src/                        # Aplicación React
├── vite.config.ts              # Configuración de Vite
├── tsconfig.json               # Configuración TypeScript para React
└── package.json                # Dependencias y scripts
```

## Prerrequisitos

- **Node.js** (v18 o superior)
- **npm** (v9 o superior)
- **Git**

## Configuración Inicial

### 1. Clonar el repositorio
```bash
git clone https://github.com/Grupo-2-DPM/DeepSaffix-WEB.git
cd deepsaffix-web
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Instalar dependencias de desarrollo
```bash
npm install --save-dev electron typescript @types/node @types/electron
npm install --save-dev concurrently wait-on electron-builder
```

## Scripts Disponibles

### Desarrollo
```bash
# Iniciar servidor de desarrollo Vite
npm run dev
```

### Linting y Testing
```bash
npm run lint                    # Verificar código con ESLint
npm test                        # Ejecutar pruebas (si están configuradas)
```

## Comunicación entre Procesos

### Desde el Renderer (React):
```typescript
// Usar APIs expuestas en preload
console.log(window.electronAPI.platform); // 'linux', 'win32', 'darwin'
console.log(window.electronAPI.isDev);    // true/false

// Ejemplo de API personalizada
window.electronAPI.myCustomFunction?.('datos');
```

### Añadir APIs adicionales en preload:
```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  // API existente
  platform: process.platform,
  
  // Nueva API de ejemplo
  showDialog: async (message: string) => {
    return await ipcRenderer.invoke('show-dialog', message);
  },
  
  // API de sistema de archivos (con restricciones)
  readFile: async (filePath: string) => {
    return await ipcRenderer.invoke('read-file', filePath);
  }
});
```

## Configuración de Desarrollo Avanzada

### Hot Reload con electron-reloader
```bash
npm install --save-dev electron-reloader
```

**En main.ts:**
```typescript
import { app, BrowserWindow } from 'electron';

// Solo en desarrollo
if (process.env.NODE_ENV === 'development') {
  try {
    const { default: reload } = await import('electron-reloader');
    reload(module, {
      debug: true,
      watchRenderer: true
    });
  } catch {}
}
```

### Variables de entorno
Crear `.env`:
```env
VITE_APP_NAME=DeepSaffix
VITE_API_URL=http://localhost:3000
```

**En Vite/React:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Configurar alias en Vite
```typescript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  }
});
```

## Recursos Adicionales

- [Documentación oficial de Electron](https://www.electronjs.org/docs)
- [Electron con Vite](https://www.electronjs.org/docs/latest/tutorial/tutorial-vite)
- [Electron + TypeScript Best Practices](https://www.electronforge.io/guides/framework-integration/react-with-typescript)
- [Electron Builder Documentation](https://www.electron.build/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [TypeScript con ES Modules](https://www.typescriptlang.org/docs/handbook/esm-node.html)


## Changelog

### v1.0.0 (Actual)
