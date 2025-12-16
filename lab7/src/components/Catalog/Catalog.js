import React from 'react';
import CatalogProductTile from '../CatalogProductTile/CatalogProductTile';
import SearchBox from '../SearchBox/SearchBox';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import Select from '../Select/Select';

const Catalog = () => {
  const catalogProducts = [
    {
      id: 1,
      title: "LED Ceiling Pro",
      description: "Сучасна лампа для стелі забезпечує яскраве, рівномірне освітлення при мінімальному енергоспоживанні.",
      image: "/images/201.jpg",
      price: "$149.99",
      type: "LED",
      manufacturer: "LampTech",
      diodes: "120 LEDs"
    },
    {
      id: 2,
      title: "Desk Lamp Elite",
      description: "Ідеальна лампа для робочого столу з регульованою яскравістю та сучасним дизайном.",
      image: "/images/202.jpg",
      price: "$79.99",
      type: "LED",
      manufacturer: "BrightWorks",
      diodes: "60 LEDs"
    },
    {
      id: 3,
      title: "Floor Lamp Modern",
      description: "Висока напольна лампа для загального освітлення приміщення. Елегантний дизайн.",
      image: "/images/203.jpg",
      price: "$199.99",
      type: "LED",
      manufacturer: "Luminaire Co",
      diodes: "80 LEDs"
    },
    {
      id: 4,
      title: "Smart LED Panel",
      description: "Розумна LED панель з керуванням через додаток та регульованою кольоровою температурою.",
      image: "/images/204.jpg",
      price: "$129.99",
      type: "Smart LED",
      manufacturer: "TechLight",
      diodes: "200 LEDs"
    },
    {
      id: 5,
      title: "Vintage Table Lamp",
      description: "Класична настільна лампа у вінтажному стилі з енергозберігаючою LED технологією.",
      image: "/images/205.jpg",
      price: "$89.99",
      type: "LED",
      manufacturer: "Classic Lights",
      diodes: "40 LEDs"
    },
    {
      id: 6,
      title: "Industrial Pendant",
      description: "Промисловий підвісний світильник з металевим абажуром та яскравим LED освітленням.",
      image: "/images/207.jpg",
      price: "$159.99",
      type: "LED",
      manufacturer: "Industrial Glow",
      diodes: "100 LEDs"
    }
  ];

  const typeOptions = [
    { value: 'led', label: 'LED' },
    { value: 'smart-led', label: 'Smart LED' },
    { value: 'halogen', label: 'Halogen' },
    { value: 'incandescent', label: 'Incandescent' }
  ];

  const priceOptions = [
    { value: '0-50', label: '$0 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-150', label: '$100 - $150' },
    { value: '150-200', label: '$150 - $200' },
    { value: '200+', label: '$200+' }
  ];

  const manufacturerOptions = [
    { value: 'lamptech', label: 'LampTech' },
    { value: 'brightworks', label: 'BrightWorks' },
    { value: 'luminaire', label: 'Luminaire Co' },
    { value: 'techlight', label: 'TechLight' },
    { value: 'classic', label: 'Classic Lights' },
    { value: 'industrial', label: 'Industrial Glow' }
  ];

  return (
    <section className="catalog">
      <div className="container">
        <div className="catalog-header">
          <h1 className="catalog-title">Catalog</h1>
          <div className="catalog-controls">
            <SearchBox placeholder="Search products..." />
          </div>
        </div>
        
        <div className="catalog-content">
          <div className="catalog-filters">
            <div className="filter-section">
              <h3>Filter by Type</h3>
              <Select
                options={typeOptions}
                placeholder="Select lamp type..."
              />
            </div>
            
            <div className="filter-section">
              <h3>Filter by Price</h3>
              <Select
                options={priceOptions}
                placeholder="Select price range..."
              />
            </div>
            
            <div className="filter-section">
              <h3>Filter by Manufacturer</h3>
              <Select
                options={manufacturerOptions}
                placeholder="Select manufacturer..."
              />
            </div>
            
            <PrimaryButton className="apply-filters">
              Apply Filters
            </PrimaryButton>
          </div>
          
          <div className="catalog-products">
            <div className="products-grid">
              {catalogProducts.map(product => (
                <CatalogProductTile 
                  key={product.id}
                  title={product.title}
                  description={product.description}
                  image={product.image}
                  price={product.price}
                  type={product.type}
                  manufacturer={product.manufacturer}
                  diodes={product.diodes}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Catalog;