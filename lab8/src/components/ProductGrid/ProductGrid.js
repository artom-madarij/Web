import React, { useState } from 'react';
import ProductTile from '../ProductTile/ProductTile';
import PrimaryButton from '../PrimaryButton/PrimaryButton';

const ProductGrid = () => {
  const initialProducts = [
    {
      id: 1,
      title: "LED Ceiling",
      description: "Сучасна лампа для стелі забезпечує яскраве, рівномірне освітлення при мінімальному енергоспоживанні.",
      image: "/images/201.jpg"
    },
    {
      id: 2,
      title: "Desk Lamp",
      description: "Ідеальна лампа для робочого столу з регульованою яскравістю та сучасним дизайном.",
      image: "/images/202.jpg" 
    },
    {
      id: 3,
      title: "Floor Lamp",
      description: "Висока напольна лампа для загального освітлення приміщення. Елегантний дизайн та енергоефективність.",
      image: "/images/203.jpg" 
    }
  ];

  const additionalProducts = [
    {
      id: 4,
      title: "Smart LED Panel",
      description: "Розумна LED панель з керуванням через додаток. Додатковий товар для демонстрації функціоналу View More.",
      image: "/images/204.jpg"
    },
    {
      id: 5,
      title: "Vintage Table Lamp",
      description: "Класична настільна лампа у вінтажному стилі. Енергозберігаюча LED технологія в класичному дизайні.",
      image: "/images/205.jpg"
    },
    {
      id: 6,
      title: "Industrial Pendant",
      description: "Промисловий підвісний світильник з металевим абажуром. Ідеально підходить для лофт інтер'єрів.",
      image: "/images/207.jpg"
    }
  ];

  const [products, setProducts] = useState(initialProducts);
  const [showAll, setShowAll] = useState(false);

  const handleViewMore = () => {
    if (!showAll) {
      setProducts([...initialProducts, ...additionalProducts]);
    } else {
      setProducts(initialProducts);
    }
    setShowAll(!showAll);
  };

  return (
    <section className="product-grid">
      <div className="container">
        <div className="grid">
          {products.map(product => (
            <ProductTile 
              key={product.id}
              title={product.title}
              description={product.description}
              image={product.image} 
            />
          ))}
        </div>
        <div className="view-more">
          <PrimaryButton className="view-more-btn" onClick={handleViewMore}>
            {showAll ? 'Show Less' : 'View More'}
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;