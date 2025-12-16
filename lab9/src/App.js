import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ProductGrid from './components/ProductGrid/ProductGrid'; 
import Catalog from './components/Catalog/Catalog';
import Item from './components/Item/Item';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <ProductGrid />
            </>
          } />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/home" element={
            <>
              <Hero />
              <ProductGrid />
            </>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
