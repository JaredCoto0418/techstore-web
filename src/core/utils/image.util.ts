const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Valida un archivo de imagen (tipo y tamaño).
 * Devuelve un mensaje de error si no es válido, o null si es válido.
 */
export const validateImageFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return 'Formato de archivo no válido. Use JPG, PNG, GIF o BMP.';
    }
    if (file.size > MAX_SIZE_BYTES) {
        return 'El archivo es demasiado grande. Máximo 5MB.';
    }
    return null;
};
