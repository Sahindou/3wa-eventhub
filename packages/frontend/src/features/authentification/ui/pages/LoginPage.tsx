import Form from '../components/Form'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../store/authThunks'
import {
  selectIsLoading,
  selectError,
  selectIsAuthenticated,
  selectRequires2FAVerification,
} from '../../store/authSelectors'
import { clearError } from '../../store/authSlice'
import type { AppDispatch } from '../../../../modules/store/store'
import { useNavigate } from 'react-router-dom'

interface FormState {
  email: string
  password: string
}

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
  })
  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>()
  const isLoading = useSelector(selectIsLoading)
  const error = useSelector(selectError)
  const isAuth = useSelector(selectIsAuthenticated)
  const requires2FA = useSelector(selectRequires2FAVerification)

  const handleChange = (name: string, value: string): void => {
    setForm((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const isDisabled: boolean = form.email === '' || form.password === '' || isLoading

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(loginUser(form.email, form.password))
  }

  // Redirige vers /profile dès que isAuth passe à true
  useEffect(() => {
    if (isAuth) {
      navigate('/profile')
    }
  }, [isAuth, navigate])

  // Redirige vers la vérification 2FA si nécessaire
  useEffect(() => {
    if (requires2FA) {
      navigate('/2fa-verify')
    }
  }, [requires2FA, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  return (
    <>
      <Form title="Login" onSubmit={handleSubmit} disabled={isDisabled} submitText="Login">
        <div className="space-y-4">
          {/* Email Input */}
          <div className="relative flex items-center">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none"
            >
              <path
                strokeWidth="1.5"
                stroke="currentColor"
                d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
              />
            </svg>
            <input
              required
              placeholder="Enter your email"
              className="w-full h-10 px-9 text-sm border border-gray-200 rounded-lg bg-slate-50 text-slate-800 placeholder:text-slate-500 transition-all duration-200 hover:border-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 valid:border-emerald-500 valid:[&:not(:placeholder-shown)]:border-emerald-500 invalid:[&:not(:placeholder-shown)]:border-red-500 invalid:[&:not(:placeholder-shown)]:animate-shake"
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="relative flex items-center">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none"
            >
              <path
                strokeWidth="1.5"
                stroke="currentColor"
                d="M12 10V14M8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z"
              />
            </svg>
            <input
              required
              placeholder="Enter your password"
              className="w-full h-10 px-9 text-sm border border-gray-200 rounded-lg bg-slate-50 text-slate-800 placeholder:text-slate-500 transition-all duration-200 hover:border-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 valid:border-emerald-500 valid:[&:not(:placeholder-shown)]:border-emerald-500 invalid:[&:not(:placeholder-shown)]:border-red-500 invalid:[&:not(:placeholder-shown)]:animate-shake"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
            <button
              className="absolute right-3 flex items-center p-1 text-slate-500 transition-all duration-200 hover:text-blue-500 hover:scale-110 active:scale-90"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg fill="none" viewBox="0 0 24 24" className="w-4 h-4">
                <path
                  strokeWidth="1.5"
                  stroke="currentColor"
                  d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                />
                <circle strokeWidth="1.5" stroke="currentColor" r={3} cy={12} cx={12} />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>
      </Form>
    </>
  )
}
