import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ProductGrid from './components/ProductGrid/ProductGrid'; 
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <ProductGrid />
      <Footer />
    </div>
  );
}

export default App;
