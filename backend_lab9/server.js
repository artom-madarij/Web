const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lamp_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/api/products', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { search, type, manufacturer, minPrice, maxPrice, sortBy, sortOrder } = req.query;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR manufacturer LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    
    if (manufacturer) {
      query += ' AND manufacturer = ?';
      params.push(manufacturer);
    }
    
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }
    
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }
    
    if (sortBy === 'price') {
      const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY price ${order}`;
    } else {
      query += ' ORDER BY id ASC';
    }
    
    const [rows] = await connection.execute(query, params);
    res.json(rows);
    
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Помилка сервера', message: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.get('/api/products/:id', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Невірний ID продукту' });
    }
    
    const [rows] = await connection.execute('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Продукт не знайдено' });
    }
    
    res.json(rows[0]);
    
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Помилка сервера', message: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.get('/api/cart', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const userId = 1;
    
    const [rows] = await connection.execute(`
      SELECT ci.*, p.title, p.price, p.image, p.stock 
      FROM cart_items ci 
      JOIN products p ON ci.product_id = p.id 
      WHERE ci.user_id = ?
    `, [userId]);
    
    res.json(rows);
    
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Помилка сервера', message: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.post('/api/cart', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { productId, quantity = 1, temperature = 'warm-white' } = req.body;
    const userId = 1;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID обов\'язковий' });
    }
    
    const [productRows] = await connection.execute('SELECT * FROM products WHERE id = ?', [productId]);
    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Продукт не знайдено' });
    }
    
    if (productRows[0].stock < quantity) {
      return res.status(400).json({ error: 'Недостатньо товару на складі' });
    }
    
    const [existingRows] = await connection.execute(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND temperature = ?', 
      [userId, productId, temperature]
    );
    
    if (existingRows.length > 0) {
      const newQuantity = existingRows[0].quantity + quantity;
      if (newQuantity > 10) {
        return res.status(400).json({ error: 'Максимальна кількість для одного товару - 10 шт.' });
      }
      await connection.execute(
        'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ? AND temperature = ?',
        [newQuantity, userId, productId, temperature]
      );
    } else {
      if (quantity > 10) {
        return res.status(400).json({ error: 'Максимальна кількість для одного товару - 10 шт.' });
      }
      await connection.execute(
        'INSERT INTO cart_items (user_id, product_id, quantity, temperature) VALUES (?, ?, ?, ?)',
        [userId, productId, quantity, temperature]
      );
    }
    
    res.json({ success: true, message: 'Товар додано до кошика' });
    
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Помилка сервера', message: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.put('/api/cart/:productId', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { productId } = req.params;
    const { quantity, temperature = 'warm-white' } = req.body;
    const userId = 1;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Кількість має бути більше 0' });
    }
    
    if (quantity > 10) {
      return res.status(400).json({ error: 'Максимальна кількість для одного товару - 10 шт.' });
    }
    
    await connection.execute(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ? AND temperature = ?',
      [quantity, userId, productId, temperature]
    );
    
    res.json({ success: true, message: 'Кількість оновлено' });
    
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Помилка сервера', message: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.delete('/api/cart/:productId', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { productId } = req.params;
    const { temperature = 'warm-white' } = req.body;
    const userId = 1;
    
    await connection.execute(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ? AND temperature = ?',
      [userId, productId, temperature]
    );
    
    res.json({ success: true, message: 'Товар видалено з кошика' });
    
  } catch (error) {
    console.error('Error deleting from cart:', error);
    res.status(500).json({ error: 'Помилка сервера', message: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.delete('/api/cart', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const userId = 1;
    
    await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    
    res.json({ success: true, message: 'Кошик очищено' });
    
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Помилка сервера', message: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'Сервер працює', timestamp: new Date().toISOString() });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Маршрут не знайдено' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
  console.log(`API доступне за адресою: http://localhost:${PORT}/api`);
});