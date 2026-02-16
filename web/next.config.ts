import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilitar export estático para GitHub Pages
  output: 'export',

  // Configurar basePath para GitHub Pages (comentar si usas dominio personalizado)
  // basePath: '/fondita',

  // Deshabilitar optimización de imágenes para export estático
  images: {
    unoptimized: true,
  },

  // Configuración de trailing slash
  trailingSlash: true,
};

export default nextConfig;
