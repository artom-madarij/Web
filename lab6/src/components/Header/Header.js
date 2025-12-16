import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <div className="logo-circle">
            <div className="logo-outer">
              <div className="logo-inner"></div>
            </div>
          </div>
        </div>
        <nav className="navigation">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#catalog">Catalog</a></li>
            <li><a href="#cart">Cart</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;