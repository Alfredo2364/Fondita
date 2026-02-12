import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
    try {
        const { email, password, name, role } = await request.json();

        // Validar datos
        if (!email || !password || !name || !role) {
            return NextResponse.json(
                { error: 'Faltan datos requeridos' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }

        // Crear usuario en Firebase Auth
        const userRecord = await adminAuth.createUser({
            email,
            password,
            displayName: name,
        });

        // Crear documento en Firestore
        await adminDb.collection('users').doc(userRecord.uid).set({
            email,
            name,
            role,
            createdAt: new Date(),
            restaurantId: 'default_restaurant'
        });

        return NextResponse.json({
            success: true,
            uid: userRecord.uid,
            message: 'Usuario creado exitosamente'
        });

    } catch (error: any) {
        console.error('Error creating user:', error);

        // Manejar errores específicos de Firebase
        if (error.code === 'auth/email-already-exists') {
            return NextResponse.json(
                { error: 'El correo ya está registrado' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Error al crear usuario: ' + error.message },
            { status: 500 }
        );
    }
}
