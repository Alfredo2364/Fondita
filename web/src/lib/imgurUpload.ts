// Servicio para subir imágenes a Imgur
// Soporta imágenes de hasta 10MB con compresión automática

const IMGUR_CLIENT_ID = 'YOUR_IMGUR_CLIENT_ID'; // Reemplazar con tu Client ID de Imgur

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Comprime una imagen antes de subirla con algoritmo mejorado
 * @param file Archivo de imagen
 * @param maxSizeMB Tamaño máximo en MB (default: 10)
 * @param quality Calidad de compresión 0-1 (default: 0.9 para mejor calidad)
 */
async function compressImage(
  file: File,
  maxSizeMB: number = 10,
  quality: number = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calcular nuevas dimensiones manteniendo aspect ratio
        // Aumentado a 3840px para mejor calidad (4K)
        const maxDimension = 3840; // Máximo 4K para excelente calidad
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d', {
          alpha: false, // Mejor rendimiento para JPG
          willReadFrequently: false
        });

        if (!ctx) {
          reject(new Error('No se pudo obtener contexto del canvas'));
          return;
        }

        // Fondo blanco para transparencias
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Mejor calidad de renderizado
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a Blob con compresión
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const sizeMB = blob.size / 1024 / 1024;

              // Si aún es muy grande, reducir calidad gradualmente
              if (sizeMB > maxSizeMB && quality > 0.5) {
                console.log(`Tamaño ${sizeMB.toFixed(2)}MB > ${maxSizeMB}MB, reduciendo calidad...`);
                compressImage(file, maxSizeMB, quality - 0.05).then(resolve).catch(reject);
              } else {
                console.log(`✅ Compresión exitosa: ${sizeMB.toFixed(2)}MB con calidad ${(quality * 100).toFixed(0)}%`);
                resolve(blob);
              }
            } else {
              reject(new Error('Error al comprimir imagen'));
            }
          },
          'image/jpeg', // JPEG para mejor compresión
          quality
        );
      };

      img.onerror = () => reject(new Error('Error al cargar imagen'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Error al leer archivo'));
    reader.readAsDataURL(file);
  });
}

/**
 * Sube una imagen a Imgur
 * @param file Archivo de imagen
 * @param onProgress Callback de progreso (opcional)
 */
export async function uploadToImgur(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  try {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'El archivo debe ser una imagen' };
    }

    // Validar tamaño inicial (máximo 50MB antes de comprimir)
    const maxInitialSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxInitialSize) {
      return {
        success: false,
        error: 'La imagen es demasiado grande. Máximo 50MB.'
      };
    }

    onProgress?.(10);

    // Comprimir imagen si es necesario
    let imageToUpload: Blob = file;
    if (file.size > 500 * 1024) { // Si es mayor a 500KB, comprimir
      console.log('🗜️ Comprimiendo imagen...');
      console.log(`📊 Tamaño original: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      imageToUpload = await compressImage(file, 10, 0.9); // Calidad 90%
      console.log(`✅ Tamaño comprimido: ${(imageToUpload.size / 1024 / 1024).toFixed(2)}MB`);
    }

    onProgress?.(30);

    // Convertir a Base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remover el prefijo "data:image/...;base64,"
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageToUpload);
    });

    onProgress?.(50);

    // Subir a Imgur
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64,
        type: 'base64',
      }),
    });

    onProgress?.(80);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de Imgur:', errorData);
      return {
        success: false,
        error: `Error al subir: ${errorData.data?.error || response.statusText}`
      };
    }

    const data = await response.json();
    onProgress?.(100);

    return {
      success: true,
      url: data.data.link, // URL directa de la imagen
    };

  } catch (error) {
    console.error('Error al subir imagen:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Valida si una URL de imagen es válida
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const pathname = urlObj.pathname.toLowerCase();
    return validExtensions.some(ext => pathname.endsWith(ext)) ||
      pathname.includes('/') && !pathname.endsWith('/');
  } catch {
    return false;
  }
}

/**
 * Obtiene el tamaño de una imagen desde una URL
 */
export async function getImageSize(url: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve(null);
    img.src = url;
  });
}
