# DeepSaffix - WEB TypeScript + React + Vite

Este proyecto utiliza **TypeScript**, **React** y **Vite** para crear una aplicación de escritorio multiplataforma.

## Estructura del Proyecto

```
deepsaffix-web/
├── src
│   ├── main.tsx            # Punto de entrada
│   ├── App.tsx             # Componente raíz
│   ├── App.css             # Estilos globales
│   ├── index.css           # Estilos base/Tailwind
│   │
│   ├── api/                # Conexiones externas
│   │   └── http.ts
│   │
│   ├── assets/             # Recursos estáticos
│   │   └── react.svg
│   │
│   ├── components/         # Componentes transversales
│   │   ├── common/
│   │   │   └── Hero.tsx
│   │   └── ui/                # Botones, Inputs, etc.
│   │
│   ├── features/           # Módulos por dominio (Lógica de negocio)
│   │   ├── auth/
│   │   │   └── components/
│   │   │       └── AuthForm.tsx
│   │   └── simulation/
│   │       └── components/
│   │           ├── index.ts
│   │           └── SimulationPanel.tsx
│   │
│   ├── layouts/            # Estructura de página
│   │   ├── footer/
│   │   │   ├── footer.data.ts
│   │   │   └── Footer.tsx
│   │   └── navbar/
│   │       ├── navbar,data.ts
│   │       └── Navbar.tsx
│   │
│   └── soporte/            # Carpetas de utilidad y lógica
│       ├── config/            # Constantes y variables de entorno
│       ├── hooks/             # Lógica de React reutilizable
│       ├── pages/             # Vistas de la aplicación
│       ├── services/          # Lógica de servicios adicional
│       ├── store/             # Gestión de estado global
│       ├── types/             # Definiciones TypeScript
│       └── utils/             # Funciones auxiliares
│   ├── eslint.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── README.md
│   └── index.html
│
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

### 3. Instalar dependencias de desarrollo (Electron opcional)
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

### Linting y Testing (Opcional)
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

## Configuración de con electron

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
