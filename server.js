import express from 'express';
import sequelize, { Product } from './models/database.js';
import { defaultProducts } from './defaultData/defaultproducts.js';

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
  const products = await Product.findAll();
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', async (req, res) => {
  const { image, name, priceCents, rating, keywords } = req.body;
  try {
    const product = await Product.create({
      image,
      name,
      priceCents: priceCents ?? Math.round((req.body.price ?? 0) * 100),
      rating: rating ?? { stars: 0, count: 0 },
      keywords: keywords ?? [],
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const { image, name, priceCents, rating, keywords } = req.body;
  try {
    await product.update({
      image: image ?? product.image,
      name: name ?? product.name,
      priceCents: priceCents ?? product.priceCents,
      rating: rating ?? product.rating,
      keywords: keywords ?? product.keywords,
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

  await product.destroy();
  res.status(204).end();
});

// POST example
app.post('/api/data', (req, res) => {
  const data = req.body;

  res.json({
    message: 'Data received successfully',
    data: data,
  });
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('SQLite/Sequelize connected and synced.');

    // Seed default products if database is empty
    const productCount = await Product.count();
    if (productCount === 0) {
      await Product.bulkCreate(defaultProducts);
      console.log(`Seeded ${defaultProducts.length} default products successfully.`);
    }
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
