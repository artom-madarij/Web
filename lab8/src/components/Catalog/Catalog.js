import React, { useState, useCallback, useEffect } from 'react';
import CatalogProductTile from '../CatalogProductTile/CatalogProductTile';
import SearchBox from '../SearchBox/SearchBox';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import Select from '../Select/Select';

const Catalog = () => {
  const initialProducts = [
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

  const [products] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'LED', label: 'LED' },
    { value: 'Smart LED', label: 'Smart LED' }
  ];

  const priceOptions = [
    { value: '', label: 'All Prices' },
    { value: '0-100', label: '$0 - $100' },
    { value: '100-150', label: '$100 - $150' },
    { value: '150-200', label: '$150 - $200' },
    { value: '200+', label: '$200+' }
  ];

  const manufacturerOptions = [
    { value: '', label: 'All Manufacturers' },
    { value: 'LampTech', label: 'LampTech' },
    { value: 'BrightWorks', label: 'BrightWorks' },
    { value: 'Luminaire Co', label: 'Luminaire Co' },
    { value: 'TechLight', label: 'TechLight' },
    { value: 'Classic Lights', label: 'Classic Lights' },
    { value: 'Industrial Glow', label: 'Industrial Glow' }
  ];

  const sortOptions = [
    { value: '', label: 'Default Order' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' }
  ];

  const applyFilters = useCallback(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(product => product.type === typeFilter);
    }

    if (manufacturerFilter) {
      filtered = filtered.filter(product => product.manufacturer === manufacturerFilter);
    }

    if (priceFilter) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price.replace('$', ''));
        switch (priceFilter) {
          case '0-100': return price <= 100;
          case '100-150': return price > 100 && price <= 150;
          case '150-200': return price > 150 && price <= 200;
          case '200+': return price > 200;
          default: return true;
        }
      });
    }

    if (sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const priceA = parseFloat(a.price.replace('$', ''));
        const priceB = parseFloat(b.price.replace('$', ''));
        
        switch (sortOrder) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, typeFilter, priceFilter, manufacturerFilter, sortOrder]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setPriceFilter('');
    setManufacturerFilter('');
    setSortOrder('');
  };

  return (
    <section className="catalog">
      <div className="container">
        <div className="catalog-header">
          <h1 className="catalog-title">Catalog</h1>
          <div className="catalog-controls">
            <SearchBox 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        <div className="catalog-content">
          <div className="catalog-filters">
            <div className="filter-section">
              <h3>Sort by Price</h3>
              <Select
                options={sortOptions}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                placeholder="Sort products..."
              />
            </div>

            <div className="filter-section">
              <h3>Filter by Type</h3>
              <Select
                options={typeOptions}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                placeholder="Select lamp type..."
              />
            </div>
            
            <div className="filter-section">
              <h3>Filter by Price Range</h3>
              <Select
                options={priceOptions}
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                placeholder="Select price range..."
              />
            </div>
            
            <div className="filter-section">
              <h3>Filter by Manufacturer</h3>
              <Select
                options={manufacturerOptions}
                value={manufacturerFilter}
                onChange={(e) => setManufacturerFilter(e.target.value)}
                placeholder="Select manufacturer..."
              />
            </div>
            
            <div className="filter-actions">
              <button className="reset-filters" onClick={resetFilters}>
                Reset All Filters
              </button>
            </div>
          </div>
          
          <div className="catalog-products">
            <div className="products-info">
              <p>Found {filteredProducts.length} products</p>
            </div>
            <div className="products-grid">
              {filteredProducts.map(product => (
                <CatalogProductTile 
                  key={product.id}
                  id={product.id}
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
            {filteredProducts.length === 0 && (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
                <PrimaryButton onClick={resetFilters}>
                  Reset Filters
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Catalog;