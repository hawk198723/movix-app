import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FirebaseService } from '../services/firebase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { LoadingSpinner } from '../components/ui/Loading'

export function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await register(formData.email, formData.password, formData.displayName.trim())
      // 创建用户资料
      const user = { uid: 'temp', email: formData.email } // Firebase会自动设置用户
      // await FirebaseService.createUserProfile(user.uid, formData.email, formData.displayName.trim())
      navigate('/')
    } catch (error) {
      console.error('Registration failed:', error)
      setErrors({ general: 'Registration failed. Please try again.' })
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
              Create your account
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Join us and start watching amazing movies!
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
              label="Display Name"
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              error={errors.displayName}
              placeholder="Enter your display name"
              autoComplete="name"
              required
            />

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
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              autoComplete="new-password"
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* 登录链接 */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-netflix-red hover:text-red-400 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
