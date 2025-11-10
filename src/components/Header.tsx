import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, User, LogOut, Menu, X, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Button } from './ui/Button'

export function Header() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/my-list', label: 'My List' }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-netflix-black/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="text-netflix-red text-2xl sm:text-3xl font-bold hover:opacity-80 transition-opacity flex-shrink-0">
            MOVIX
          </Link>

          {/* Desktop Navigation - 左对齐 */}
          <nav className="hidden lg:flex items-center space-x-8 ml-12">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-netflix-red dark:hover:text-netflix-red transition-colors relative group whitespace-nowrap"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-netflix-red group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-48 xl:w-64 px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
            </form>

            {/* Mobile/Tablet Search Button */}
            <Link 
              to="/search" 
              className="lg:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-400" />
              )}
            </button>

            {/* Desktop User Menu */}
            {user ? (
              <div className="hidden lg:flex items-center space-x-3">
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                    {user.displayName || user.email}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="bg-netflix-red hover:bg-red-700 font-medium">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - 改进的动画和样式 */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-1">
              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-netflix-red dark:hover:text-netflix-red rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Divider */}
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
              
              {user ? (
                <>
                  {/* Profile Link */}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span className="flex-1 truncate">{user.displayName || user.email}</span>
                  </Link>
                  
                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 px-4 pt-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full">
                    <Button variant="outline" className="w-full justify-center font-medium">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full">
                    <Button variant="primary" className="w-full justify-center bg-netflix-red hover:bg-red-700 font-medium">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
