import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import Select from '../Select/Select';

const Item = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const items = [
    {
      id: 1,
      title: "LED Ceiling Pro",
      description: "Сучасна лампа для стелі забезпечує яскраве, рівномірне освітлення при мінімальному енергоспоживанні. Ідеально підходить для вітальні, кухні або офісу.",
      image: "/images/201.jpg",
      price: "$149.99",
      characteristic1: "Energy Saving",
      characteristic2: "Modern Design",
      countable: "120",
      brand: "LampTech"
    },
    {
      id: 2,
      title: "Desk Lamp Elite",
      description: "Ідеальна лампа для робочого столу з регульованою яскравістю та сучасним дизайном. Забезпечує комфортне освітлення для роботи та читання.",
      image: "/images/202.jpg",
      price: "$79.99",
      characteristic1: "Adjustable Brightness",
      characteristic2: "LED Technology",
      countable: "60",
      brand: "BrightWorks"
    },
    {
      id: 3,
      title: "Floor Lamp Modern",
      description: "Висока напольна лампа для загального освітлення приміщення. Елегантний дизайн та енергоефективність. Ідеально для вітальні чи спальні.",
      image: "/images/203.jpg",
      price: "$199.99",
      characteristic1: "Tall Design",
      characteristic2: "Ambient Lighting",
      countable: "80",
      brand: "Luminaire Co"
    },
    {
      id: 4,
      title: "Smart LED Panel",
      description: "Розумна LED панель з керуванням через додаток та регульованою кольоровою температурою. Можливість налаштування освітлення під ваш настрій.",
      image: "/images/204.jpg",
      price: "$129.99",
      characteristic1: "Smart Control",
      characteristic2: "Color Adjustable",
      countable: "200",
      brand: "TechLight"
    },
    {
      id: 5,
      title: "Vintage Table Lamp",
      description: "Класична настільна лампа у вінтажному стилі з енергозберігаючою LED технологією. Додає затишку та характеру будь-якому інтер'єру.",
      image: "/images/205.jpg",
      price: "$89.99",
      characteristic1: "Vintage Style",
      characteristic2: "Energy Efficient",
      countable: "40",
      brand: "Classic Lights"
    },
    {
      id: 6,
      title: "Industrial Pendant",
      description: "Промисловий підвісний світильник з металевим абажуром та яскравим LED освітленням. Ідеальний вибір для лофт інтер'єрів.",
      image: "/images/207.jpg",
      price: "$159.99",
      characteristic1: "Industrial Style",
      characteristic2: "Metal Shade",
      countable: "100",
      brand: "Industrial Glow"
    }
  ];

  const item = items.find(item => item.id === parseInt(id));

  if (!item) {
    return (
      <section className="item-page">
        <div className="container">
          <div className="item-navigation">
            <button 
              className="back-button"
              onClick={() => navigate('/catalog')}
            >
              ← Back to Catalog
            </button>
          </div>
          <div className="not-found">
            <h2>Product not found</h2>
            <PrimaryButton onClick={() => navigate('/catalog')}>
              Back to Catalog
            </PrimaryButton>
          </div>
        </div>
      </section>
    );
  }

  const selectOptions = [
    { value: 'warm-white', label: 'Warm White (2700K)' },
    { value: 'cool-white', label: 'Cool White (4000K)' },
    { value: 'daylight', label: 'Daylight (5000K)' }
  ];

  return (
    <section className="item-page">
      <div className="container">
        <div className="item-navigation">
          <button 
            className="back-button"
            onClick={() => navigate('/catalog')}
          >
            ← Back to Catalog
          </button>
        </div>

        <div className="item-content">
          <div className="item-image">
            <img src={item.image} alt={item.title} />
          </div>
          
          <div className="item-details">
            <div className="characteristics">
              <span className="characteristic">{item.characteristic1}</span>
              <span className="characteristic">{item.characteristic2}</span>
            </div>
            
            <h1 className="item-title">{item.title}</h1>
            <p className="item-description">{item.description}</p>
            
            <div className="item-fields">
              <div className="field-group">
                <label className="field-label">LED Count</label>
                <div className="countable-field">{item.countable} LEDs</div>
              </div>
              
              <div className="field-group">
                <label className="field-label">Color Temperature</label>
                <Select 
                  options={selectOptions}
                  placeholder="Select temperature"
                  className="item-select"
                />
              </div>
            </div>
            
            <div className="item-divider"></div>
            
            <div className="item-price">Price: {item.price}</div>
            
            <div className="item-actions">
              <PrimaryButton 
                className="back-btn"
                onClick={() => navigate('/catalog')}
              >
                Go back
              </PrimaryButton>
              <PrimaryButton className="add-to-cart-btn">
                Add to cart
              </PrimaryButton>
            </div>
            
            <div className="item-divider"></div>
            
            {}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Item;