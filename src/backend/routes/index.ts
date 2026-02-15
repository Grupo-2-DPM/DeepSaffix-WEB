/**
 * Frontend route definitions that map UI routes to API endpoints.
 * Example usage:
 *  - GET /usuarios -> usuariosService.list()
 *  - POST /auth/login -> authService.login()
 */

export const API_ROUTES = {
  auth: {
    login: '/auth/login',
  },
  usuarios: {
    base: '/usuarios',
    eliminar: (id: number) => `/usuarios/${id}/eliminar`,
  },
  perfilAcademico: (id: number) => `/perfil-academico/${id}`,
  simulation: '/simulation',
};

export default API_ROUTES;
