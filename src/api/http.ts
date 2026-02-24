// URLs constantes
export const ONLINE_API_URL = import.meta.env.VITE_API_URL || "https://tu-api-produccion.com";
export const LOCAL_API_URL = "http://localhost:3000";

/**
 * Obtiene la URL configurada por el usuario o la de producción por defecto
 */
export const getBaseUrl = (): string => {
  const preference = localStorage.getItem('api_preference');
  return preference === 'local' ? LOCAL_API_URL : ONLINE_API_URL;
};

export async function http<T>(path: string, options?: RequestInit): Promise<T> {
    const baseUrl = getBaseUrl();
    
    const res = await fetch(`${baseUrl}${path}`, {
        headers: { 
            "Content-Type": "application/json", 
            ...(options?.headers ?? {}) 
        },
        ...options,
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `HTTP ${res.status}`);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}