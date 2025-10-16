import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Customers from './pages/Customers';
import UserManagement from './pages/UserManagement';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/customers" 
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user-management" 
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <UserManagement />
                  </AdminRoute>
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/customers" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
