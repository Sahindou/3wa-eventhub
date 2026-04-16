import { Link } from 'react-router-dom'

interface Form {
  title: string
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  disabled?: boolean
  submitText?: string
}

const Form: React.FC<Form> = ({
  title,
  children,
  onSubmit,
  disabled = false,
  submitText = 'Create Account',
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        className="relative w-[300px] p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
        onSubmit={onSubmit}
      >
        {/* Title */}
        <h2 className="text-[22px] font-semibold text-slate-800 mb-6 text-center tracking-tight">
          {title}
        </h2>

        {/* Form Body */}
        {children}

        {/* Submit Button */}
        <button
          className="relative w-full h-10 mt-2 bg-blue-500 text-white text-sm font-medium rounded-lg overflow-hidden transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.25),0_2px_4px_rgba(59,130,246,0.15)] active:translate-y-0 active:shadow-none group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          type="submit"
          disabled={disabled}
        >
          <span className="relative z-10">{submitText}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-500 group-hover:translate-x-full" />
        </button>

        {/* Footer */}
        <div className="mt-4 text-center text-[13px]">
          <Link
            to={title === 'Login' ? '/register' : '/login'}
            className="text-slate-500 no-underline transition-colors duration-200 hover:text-slate-800"
          >
            {title === 'Login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span className="text-blue-500 font-medium hover:text-blue-600">
              {title === 'Login' ? 'Sign up' : 'Login'}
            </span>
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Form
