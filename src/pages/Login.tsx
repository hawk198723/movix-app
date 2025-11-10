import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { LoadingSpinner } from '../components/ui/Loading'

export function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await login(formData.email, formData.password)
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
      setErrors({ general: 'Invalid email or password' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-netflix-black flex items-center justify-center px-4 transition-colors duration-200">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-netflix-red/10 to-transparent" />
      
      <div className="relative w-full max-w-md">
        <div className="bg-white/95 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 transition-colors duration-200">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="text-netflix-red text-3xl font-bold">
              MOVIX
            </Link>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-900/20 border border-red-500 rounded-md p-3">
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || loading}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* 注册链接 */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-netflix-red hover:text-red-400 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* 演示账户 */}
          <div className="mt-4 p-4 bg-gray-800/50 rounded-md">
            <p className="text-gray-400 text-sm text-center">
              Demo: Use any email and password (6+ chars)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
