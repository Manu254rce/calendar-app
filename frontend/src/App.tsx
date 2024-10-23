import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/home';
import Login from './pages/login';
import React from 'react';
import Register from './pages/register';

function ProtectedRoute({ children }: { children: React.ReactNode}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>;
  }

  return <>{children}</>
}

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
            </ProtectedRoute>
          } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;