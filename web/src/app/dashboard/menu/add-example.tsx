'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';

export default function AddDishExample() {
    const [dishData, setDishData] = useState({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        categoryId: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Aquí guardarías en Firestore
        console.log('Datos del platillo:', dishData);

        // Ejemplo de guardado en Firestore:
        // await addDoc(collection(db, 'dishes'), dishData);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Agregar Platillo</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Nombre del Platillo
                    </label>
                    <input
                        type="text"
                        value={dishData.name}
                        onChange={(e) => setDishData({ ...dishData, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Descripción
                    </label>
                    <textarea
                        value={dishData.description}
                        onChange={(e) => setDishData({ ...dishData, description: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        rows={3}
                        required
                    />
                </div>

                {/* Precio */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Precio
                    </label>
                    <input
                        type="number"
                        value={dishData.price}
                        onChange={(e) => setDishData({ ...dishData, price: Number(e.target.value) })}
                        className="w-full px-4 py-2 border rounded-lg"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                {/* COMPONENTE DE UPLOAD DE IMAGEN */}
                <ImageUploader
                    onImageUploaded={(url) => setDishData({ ...dishData, imageUrl: url })}
                    currentImageUrl={dishData.imageUrl}
                    label="Imagen del Platillo"
                    maxSizeMB={10}
                />

                {/* Botón de envío */}
                <button
                    type="submit"
                    disabled={!dishData.imageUrl}
                    className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {dishData.imageUrl ? 'Guardar Platillo' : 'Selecciona una imagen primero'}
                </button>
            </form>

            {/* Debug: Mostrar datos actuales */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-bold mb-2">Datos actuales:</h3>
                <pre className="text-xs overflow-auto">
                    {JSON.stringify(dishData, null, 2)}
                </pre>
            </div>
        </div>
    );
}
