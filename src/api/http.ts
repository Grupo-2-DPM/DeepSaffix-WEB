// 1. Priorizamos la URL de entorno, pero no asignamos el fallback aquí
export const API_URL = import.meta.env.VITE_API_URL;
const LOCAL_URL = "http://localhost:3000";

export async function http<T>(path: string, options?: RequestInit): Promise<T> {
    // Determinamos la URL inicial (Producción si existe, si no, Local)
    const currentUrl = API_URL || LOCAL_URL;
    
    try {
        // Intento primario
        console.log(`Intentando conectar a: ${currentUrl}${path}`);
        return await makeRequest<T>(currentUrl, path, options);
    } catch (error) {
        // Si ya estábamos en localhost y falló, o si no hay API_URL definida, lanzamos el error
        if (currentUrl === LOCAL_URL || !API_URL) {
            alert("Error crítico: Ni el servidor ni el Localhost responden.");
            throw error;
        }

        // FALLBACK: Si falló la API real, intentamos con Localhost
        console.warn("La API principal no responde. Cambiando a Localhost...");
        alert("La API remota falló. Usando fallback: http://localhost:3000");
        
        try {
            return await makeRequest<T>(LOCAL_URL, path, options);
        } catch (localError) {
            alert("Error: El servidor local tampoco está disponible.");
            throw localError;
        }
    }
}

// Función interna para evitar repetir la lógica de fetch
async function makeRequest<T>(baseUrl: string, path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
        headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
        ...options,
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `HTTP ${res.status}`);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}