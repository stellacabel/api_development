const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const verifyToken = require('../middleware/authMiddleware');

// Get all products
router.get('/', verifyToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get product by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create a new product
router.post('/add', verifyToken, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product created', productId: savedProduct._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete a product
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Full update (PUT)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const result = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', updated: result });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Partial update (PATCH)
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const result = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!result) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product partially updated', updated: result });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;