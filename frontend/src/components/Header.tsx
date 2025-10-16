import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAdmin = user?.perfil === UserProfile.Administrador;

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <img src="/Lucrare_logo.png" alt="Lucrare" className="header-logo" />
          <h1 className="header-title">Lucrare - Sistema de gestão</h1>
        </div>
        <nav className="header-nav">
          <Link 
            to="/customers" 
            className={`nav-link ${location.pathname === '/customers' ? 'active' : ''}`}
          >
            Clientes
          </Link>
          {isAdmin && (
            <Link 
              to="/user-management" 
              className={`nav-link ${location.pathname === '/user-management' ? 'active' : ''}`}
            >
              Usuários
            </Link>
          )}
        </nav>
        <div className="header-user">
          <span>
            Olá, {user?.username}
            {isAdmin && <span className="admin-badge">Admin</span>}
          </span>
          <button className="logout-btn" onClick={logout}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;