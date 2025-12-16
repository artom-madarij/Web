import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import Select from '../Select/Select';
import Loader from '../Loader/Loader';
import { productsAPI } from '../../services/api';

const Item = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', id);
        
        const response = await productsAPI.getProductById(id);
        console.log('Full API response:', response);
        
        if (response && response.data) {
          setItem(response.data);
        } else if (response) {
          setItem(response);
        } else {
          throw new Error('Дані не отримані');
        }
        
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Помилка завантаження продукту: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setError('ID продукту не вказано');
      setLoading(false);
    }
  }, [id]);

  const selectOptions = [
    { value: 'warm-white', label: 'Теплий білий (2700K)' },
    { value: 'cool-white', label: 'Холодний білий (4000K)' },
    { value: 'daylight', label: 'Денне світло (5000K)' }
  ];

  if (loading) {
    return (
      <section className="item-page">
        <div className="container">
          <Loader />
        </div>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="item-page">
        <div className="container">
          <div className="item-navigation">
            <button 
              className="back-button"
              onClick={() => navigate('/catalog')}
            >
              ← Назад до каталогу
            </button>
          </div>
          <div className="not-found">
            <h2>{error || 'Продукт не знайдено'}</h2>
            <PrimaryButton onClick={() => navigate('/catalog')}>
              Назад до каталогу
            </PrimaryButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="item-page">
      <div className="container">
        <div className="item-navigation">
          <button 
            className="back-button"
            onClick={() => navigate('/catalog')}
          >
            ← Назад до каталогу
          </button>
        </div>

        <div className="item-content">
          <div className="item-image">
            <img 
              src={item.image} 
              alt={item.title}
              onError={(e) => {
                e.target.src = '/images/placeholder.jpg';
                e.target.alt = 'Зображення не знайдено';
              }}
            />
          </div>
          
          <div className="item-details">
            <div className="characteristics">
              <span className="characteristic">{item.characteristic1 || 'Високоякісний'}</span>
              <span className="characteristic">{item.characteristic2 || 'Енергоефективний'}</span>
            </div>
            
            <h1 className="item-title">{item.title}</h1>
            <p className="item-description">{item.description}</p>
            
            <div className="item-fields">
              <div className="field-group">
                <label className="field-label">Кількість LED</label>
                <div className="countable-field">{item.diodes || 'Не вказано'}</div>
              </div>
              
              <div className="field-group">
                <label className="field-label">Температура кольору</label>
                <Select 
                  options={selectOptions}
                  placeholder="Оберіть температуру"
                  className="item-select"
                />
              </div>
            </div>
            
            <div className="item-divider"></div>
            
            <div className="item-price">Ціна: ${item.price}</div>
            
            <div className="item-actions">
              <PrimaryButton 
                className="back-btn"
                onClick={() => navigate('/catalog')}
              >
                Назад
              </PrimaryButton>
              <PrimaryButton className="add-to-cart-btn">
                Додати в кошик
              </PrimaryButton>
            </div>
            
            <div className="item-divider"></div>
            
            <div className="brand-info">
              <h3>Про виробника</h3>
              <p>Високоякісна продукція від {item.manufacturer || item.brand} з гарантією якості.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Item;