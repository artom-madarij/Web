import React from 'react';
import ProductTile from '../ProductTile/ProductTile';

const ProductGrid = () => {
  const products = [
    {
      id: 1,
      title: "LED Ceiling",
      description: "Сучасна лампа для стелі забезпечує яскраве, рівномірне освітлення при мінімальному енергоспоживанні. Вона відрізняється довговічністю, естетичним дизайном і легко вписується в будь-який інтер'єр, створюючи комфортну атмосферу вдома чи в офісі.",
      image: "/images/201.jpg"
    },
    {
      id: 2,
      title: "Desk Lamp",
      description: "Ідеальна лампа для робочого столу з регульованою яскравістю та сучасним дизайном. Ідеально підходить для читання та роботи.",
      image: "/images/202.jpg" 
    },
    {
      id: 3,
      title: "Floor Lamp",
      description: "Висока напольна лампа для загального освітлення приміщення. Елегантний дизайн та енергоефективність.",
      image: "/images/203.jpg" 
    }
  ];

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
          <button className="view-more-btn">View more</button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;