import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Search } from './pages/Search'
import { MovieDetails } from './pages/MovieDetails'
import { TVSeriesDetails } from './pages/TVSeriesDetails'
import { MyList } from './pages/MyList'
import { TVSeries } from './pages/TVSeries'
import { Loading } from './components/ui/Loading'
import { ErrorBoundary } from './components/ErrorBoundary'

// 受保护的路由组件
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-netflix-black flex items-center justify-center">
        <Loading size="lg" text="Loading..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// 公共路由（仅未登录用户可访问）
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-netflix-black flex items-center justify-center">
        <Loading size="lg" text="Loading..." />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function AppContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-netflix-black text-gray-900 dark:text-white transition-colors duration-200">
      <Routes>
        {/* 公共路由 */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* 受保护的路由 */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
            </>
          }
        />
        <Route
          path="/search"
          element={
            <>
              <Header />
              <Search />
            </>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <>
              <Header />
              <MovieDetails />
            </>
          }
        />
        <Route
          path="/tv/:id"
          element={
            <>
              <Header />
              <TVSeriesDetails />
            </>
          }
        />
        <Route
          path="/my-list"
          element={
            <ProtectedRoute>
              <Header />
              <MyList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tv-series"
          element={
            <>
              <Header />
              <TVSeries />
            </>
          }
        />

        {/* 默认重定向 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App