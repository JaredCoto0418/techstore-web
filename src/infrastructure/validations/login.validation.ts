import * as yup from 'yup';

export const loginValidationSchema = yup.object({
  email: yup.string()
    .email('El correo electrónico no es válido')
    .required('El correo electrónico es requerido'),
  password: yup.string()
    .min(2, 'La contraseña debe tener al menos 2 caracteres')
    .required('La contraseña es requerida'),
}); 