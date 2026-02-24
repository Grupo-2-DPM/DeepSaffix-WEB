// URLs base
export const REMOTE_API_URL = import.meta.env.VITE_API_URL || "https://deepsaffix-api.onrender.com";
export const LOCAL_API_URL = "http://localhost:3000";

/**
 * Función auxiliar para obtener la URL activa basada en la preferencia del usuario
 */
export const getActiveApiUrl = (): string => {
  const preference = localStorage.getItem('api_preference');
  return preference === 'local' ? LOCAL_API_URL : REMOTE_API_URL;
};

export async function http<T>(path: string, options?: RequestInit): Promise<T> {
    const baseUrl = getActiveApiUrl();
    
    // Log para depuración en consola
    console.log(`Request a: ${baseUrl}${path}`);

    const res = await fetch(`${baseUrl}${path}`, {
        headers: { 
            "Content-Type": "application/json", 
            ...(options?.headers ?? {}) 
        },
        ...options,
    });

    if (!res.ok) {
        // Intentamos parsear el error del backend
        const errorText = await res.text();
        throw new Error(errorText || `Error HTTP ${res.status}`);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}