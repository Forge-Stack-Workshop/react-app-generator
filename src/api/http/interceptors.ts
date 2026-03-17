export function setupInterceptors(http) {
  http.interceptors.request.use(
    (config) => {
      // Exemple : ajouter un token plus tard
      // config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  http.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API error:", error);
      return Promise.reject(error);
    }
  );
}
