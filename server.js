const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // Replaces body-parser.json()

// MongoDB Connection to inventory_db
mongoose.connect('mongodb://localhost:27017/inventory_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Create a product schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number
});

// Create a product model
const Product = mongoose.model('Product', productSchema);

// Route to add a product
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct); // 201 Created is more appropriate for successful POST requests
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(400).json({ error: 'Failed to add product', details: error.message });
  }
});

// Route to get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(400).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// Set up server to listen on port 5000
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
