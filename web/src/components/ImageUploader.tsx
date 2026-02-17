'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { uploadToImgur, isValidImageUrl } from '@/lib/imgurUpload';

interface ImageUploaderProps {
    onImageUploaded: (url: string) => void;
    currentImageUrl?: string;
    label?: string;
    maxSizeMB?: number;
}

export default function ImageUploader({
    onImageUploaded,
    currentImageUrl,
    label = 'Imagen del Platillo',
    maxSizeMB = 10,
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
    const [urlInput, setUrlInput] = useState('');
    const [mode, setMode] = useState<'upload' | 'url'>('upload');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setUploading(true);
        setProgress(0);

        // Mostrar preview local inmediatamente
        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);

        try {
            const result = await uploadToImgur(file, setProgress);

            if (result.success && result.url) {
                setPreviewUrl(result.url);
                onImageUploaded(result.url);
                setError(null);
            } else {
                setError(result.error || 'Error al subir imagen');
                setPreviewUrl(currentImageUrl || null);
            }
        } catch (err) {
            setError('Error inesperado al subir imagen');
            setPreviewUrl(currentImageUrl || null);
        } finally {
            setUploading(false);
            setProgress(0);
            // Limpiar input para permitir subir la misma imagen de nuevo
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleUrlSubmit = () => {
        if (!urlInput.trim()) {
            setError('Por favor ingresa una URL');
            return;
        }

        if (!isValidImageUrl(urlInput)) {
            setError('URL de imagen no válida. Debe terminar en .jpg, .png, .gif, etc.');
            return;
        }

        setPreviewUrl(urlInput);
        onImageUploaded(urlInput);
        setError(null);
        setUrlInput('');
    };

    const handleRemoveImage = () => {
        setPreviewUrl(null);
        setError(null);
        onImageUploaded('');
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>

            {/* Selector de modo */}
            <div className="flex gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => setMode('upload')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'upload'
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                >
                    📤 Subir Archivo
                </button>
                <button
                    type="button"
                    onClick={() => setMode('url')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'url'
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                >
                    🔗 Pegar URL
                </button>
            </div>

            {/* Preview de imagen */}
            {previewUrl && (
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                        onError={() => {
                            setError('Error al cargar imagen');
                            setPreviewUrl(null);
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        title="Eliminar imagen"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Modo: Subir archivo */}
            {mode === 'upload' && (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                        className="hidden"
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        className={`block w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${uploading
                            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                            : 'border-primary hover:border-primary-dark hover:bg-primary/5'
                            }`}
                    >
                        {uploading ? (
                            <div className="space-y-2">
                                <div className="text-lg">⏳ Subiendo...</div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="text-sm text-gray-600">{progress}%</div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="text-4xl">📸</div>
                                <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                    Click para seleccionar imagen
                                </div>
                                <div className="text-sm text-gray-500">
                                    Máximo {maxSizeMB}MB • JPG, PNG, GIF, WEBP
                                </div>
                                <div className="text-xs text-gray-400">
                                    Las imágenes grandes se comprimirán automáticamente
                                </div>
                            </div>
                        )}
                    </label>
                </div>
            )}

            {/* Modo: Pegar URL */}
            {mode === 'url' && (
                <div className="flex gap-2">
                    <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                        placeholder="https://i.imgur.com/ejemplo.jpg"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <button
                        type="button"
                        onClick={handleUrlSubmit}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                    >
                        Agregar
                    </button>
                </div>
            )}

            {/* Mensajes de error */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                        <span>⚠️</span>
                        <span className="text-sm">{error}</span>
                    </div>
                </div>
            )}

            {/* Información de ayuda */}
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p>💡 <strong>Consejos:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Puedes subir imágenes de hasta 50MB</li>
                    <li>Se comprimen automáticamente a ~2-5MB manteniendo excelente calidad</li>
                    <li>Resolución máxima: 4K (3840px) para mejor calidad</li>
                    <li>También puedes pegar URLs de Imgur, Unsplash, etc.</li>
                    <li>Las imágenes se hospedan en Imgur (gratis y permanente)</li>
                </ul>
            </div>
        </div>
    );
}
