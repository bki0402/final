import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ✈️ Triple
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="navbar-item">홈</Link>
          <Link to="/destinations" className="navbar-item">여행지</Link>
          {isAuthenticated ? (
            <>
              <Link to="/trips" className="navbar-item">내 여행</Link>
              <span className="navbar-user">안녕하세요, {user?.name}님</span>
              <button onClick={handleLogout} className="navbar-item btn-logout">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-item">로그인</Link>
              <Link to="/register" className="navbar-item">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

