import React from 'react'
import { Formik } from 'formik'
import { loginValidationSchema } from '../../../../infrastructure/validations/login.validation.ts'
import { useAuthStore } from '../../../stores/authStore.ts'
import { useNavigate, Link } from 'react-router-dom'

export const LoginPage = () => {
  const { login, authenticated, errorMessage, clearError } = useAuthStore()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (authenticated) {
      navigate('/')
    }
  }, [authenticated, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={loginValidationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await login(values)
            setSubmitting(false)
          }}
          enableReinitialize={false}
        >
          {({ isSubmitting, errors, touched, status, values, setFieldValue, handleSubmit }) => (
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on" method="post">
              {/* Campo oculto para mejorar el autocompletado del navegador */}
              <input type="text" style={{ display: 'none' }} autoComplete="username" />
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="username"
                  value={values.email}
                  onChange={(e) => {
                    setFieldValue('email', e.target.value);
                    clearError();
                  }}
                  onFocus={clearError}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.email && touched.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={(e) => {
                    setFieldValue('password', e.target.value);
                    clearError();
                  }}
                  onFocus={clearError}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.password && touched.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
              </div>
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm text-center">
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errorMessage}
                  </div>
                </div>
              )}
              {status && typeof status === 'string' && (
                <div className="text-red-500 text-sm text-center">
                  {status}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
              </button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 mb-2">¿No tienes una cuenta?</p>
                <Link
                  to="/register"
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  Crear cuenta de cliente
                </Link>
              </div>
              
              <div className="text-center mt-4">
                <Link
                  to="/catalog"
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  Ver catálogo sin registrarse
                </Link>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
} 