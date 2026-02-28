// URLs base
export const REMOTE_API_URL = import.meta.env.VITE_API_URL;
export const LOCAL_API_URL = "http://localhost:3000";

/**
 * Función auxiliar para obtener la URL activa basada en la preferencia del usuario
 */
export const getActiveApiUrl = (): string => {
    const preference = localStorage.getItem('api_preference');
    return preference === 'local' ? LOCAL_API_URL : REMOTE_API_URL;
};

/**
 * Función auxiliar Health Checker que verifica que la API este activa.
 */
export const checkHealth = async (): Promise<boolean> => {
    try {
        const baseUrl = getActiveApiUrl();
        const res = await fetch(`${baseUrl}/usuarios`, { method: 'GET' });
        return res.ok;
    } catch {
        return false;
    }
};


export async function http<T>(path: string, options?: RequestInit): Promise<T> {
    const baseUrl = getActiveApiUrl();
    const token = localStorage.getItem('token'); // <-- Recuperar token
    // Logica de JWT    
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options?.headers as Record<string, string> ?? {}),
    };

    // Si hay token, lo añadimos al header de Autorización
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // Log para depuración en consola
    console.log(`Request a: ${baseUrl}${path}`);

    const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        // Opcional: Si el token expiró, limpiar y redirigir
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    if (!res.ok) {
        // Intentamos parsear el error del backend
        const errorText = await res.text();
        throw new Error(errorText || `Error HTTP ${res.status}`);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}