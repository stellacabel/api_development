const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/authMiddleware');

// Get all products
router.get('/', verifyToken, (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ err });
    res.json(results);
  });
});

// Get product by ID
router.get('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM products WHERE product_Id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ err });
    if (results.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(results[0]);
  });
});


// Create a new product
router.post('/add', verifyToken, (req, res) => {
  const { productName, description, quantity, price } = req.body;
  const sql = 'INSERT INTO products (productName, description, quantity, price) VALUES (?, ?, ?, ?)';
  db.query(sql, [productName, description, quantity, price], (err, result) => {
    if (err) return res.status(500).json({ err });
    res.status(201).json({ message: 'Product created', productId: result.insertId });
  });
});

// Delete a product
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE product_Id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  });
});

// Full update (PUT)
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { productName, description, quantity, price } = req.body;
  const sql = `
    UPDATE products 
    SET productName = ?, description = ?, quantity = ?, price = ? 
    WHERE product_Id = ?
  `;
  db.query(sql, [productName, description, quantity, price, id], (err, result) => {
    if (err) return res.status(500).json({ err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated' });
  });
});

// Partial update (PATCH)
router.patch('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const keys = Object.keys(updates);
  const values = Object.values(updates);

  if (keys.length === 0) return res.status(400).json({ message: 'No fields to update' });

  const setClause = keys.map(key => `${key} = ?`).join(', ');
  const sql = `UPDATE products SET ${setClause} WHERE product_Id = ?`;

  db.query(sql, [...values, id], (err, result) => {
    if (err) return res.status(500).json({ err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product partially updated' });
  });
});

module.exports = router;

