export const BRAND_SLOGANS = [
    "Sabor que inspira, servicio que enamora.",
    "Tu pasión, nuestra tecnología.",
    "Innovando la tradición, un plato a la vez.",
    "Gestión inteligente para sabores auténticos.",
    "El corazón de tu cocina, en la palma de tu mano.",
    "Eficiencia que se prueba, calidad que se siente.",
    "Donde la tradición se encuentra con la innovación.",
    "Tu éxito es nuestro ingrediente secreto.",
    "Simplificando tu negocio, potenciando tu sabor.",
    "Más que un sistema, tu mejor aliado en la cocina."
];

export const getRandomSlogan = () => {
    return BRAND_SLOGANS[Math.floor(Math.random() * BRAND_SLOGANS.length)];
};
