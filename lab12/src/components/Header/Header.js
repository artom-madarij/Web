import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearCartState } from '../../store/slices/cartSlice';
import './Header.css';

const Header = () => {
  const { totalQuantity } = useSelector(state => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    dispatch(clearCartState());
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo-circle">
          <div className="logo-outer">
            <div className="logo-inner"></div>
          </div>
        </div>
        
        <nav className="navigation">
          <ul>
            {userEmail ? (
              <>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/catalog">Catalog</Link>
                </li>
                <li>
                  <Link to="/cart" className="cart-link">
                    Cart
                    {totalQuantity > 0 && (
                      <span className="cart-badge">{totalQuantity}</span>
                    )}
                  </Link>
                </li>
                <li className="user-info">
                  <span className="user-email">{userEmail}</span>
                  <button className="logout-btn" onClick={handleLogout}>
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;