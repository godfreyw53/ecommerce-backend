import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to your Express app!');
});

app.get('/api', (req, res) => {
  res.json({
    message: 'API is working!',
  });
});

// Product CRUD
app.get('/api/products', async (req, res) => {
  // Return only an empty array as requested
  res.json([]);
});

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({
    success: true,
    data: product
  });
});

app.post('/api/products', async (req, res) => {
  const { name, price, description } = req.body;
  try {
    const product = await Product.create({ name, price, description });
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

  const { name, price, description } = req.body;
  try {
    await product.update({ name, price, description });
    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

  await product.destroy();
  res.status(204).end();
});

// Sequelize / SQLite setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false,
});

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('SQLite/Sequelize connected and synced.');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

initializeDatabase();

// Start server
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
