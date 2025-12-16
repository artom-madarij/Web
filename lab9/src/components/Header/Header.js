import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <div className="logo-circle">
              <div className="logo-outer">
                <div className="logo-inner"></div>
              </div>
            </div>
          </Link>
        </div>
        <nav className="navigation">
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/catalog">Catalog</Link></li>
            <li><a href="#cart">Cart</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;