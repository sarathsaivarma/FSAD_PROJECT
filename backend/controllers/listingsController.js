const pool = require('../config/db');

// Get all listings (public)
const getListings = async (req, res) => {
  try {
    const { city, property_type, bhk, featured } = req.query;
    let query = 'SELECT * FROM listings WHERE is_active = TRUE';
    const params = [];
    if (city) { query += ' AND city LIKE ?'; params.push(`%${city}%`); }
    if (property_type) { query += ' AND property_type = ?'; params.push(property_type); }
    if (bhk) { query += ' AND bhk = ?'; params.push(bhk); }
    if (featured === 'true') { query += ' AND is_featured = TRUE'; }
    query += ' ORDER BY is_featured DESC, created_at DESC';
    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Get single listing
const getListingById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM listings WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Listing not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Admin: Create listing
const createListing = async (req, res) => {
  try {
    const { title, property_type, bhk, city, locality, area_sqft, price_lakh, description, image_url, features, is_featured } = req.body;
    if (!title || !property_type || !city) {
      return res.status(400).json({ success: false, message: 'title, property_type, and city are required.' });
    }
    const [result] = await pool.query(
      `INSERT INTO listings (title, property_type, bhk, city, locality, area_sqft, price_lakh, description, image_url, features, is_featured, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, property_type, bhk, city, locality, area_sqft, price_lakh, description, image_url || '', features || '', is_featured || false, req.user.id]
    );
    res.status(201).json({ success: true, message: 'Listing created.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Admin: Update listing
const updateListing = async (req, res) => {
  try {
    const { title, property_type, bhk, city, locality, area_sqft, price_lakh, description, image_url, features, is_featured, is_active } = req.body;
    await pool.query(
      `UPDATE listings SET title=?, property_type=?, bhk=?, city=?, locality=?, area_sqft=?, price_lakh=?, description=?, image_url=?, features=?, is_featured=?, is_active=?, updated_at=NOW() WHERE id=?`,
      [title, property_type, bhk, city, locality, area_sqft, price_lakh, description, image_url, features, is_featured, is_active !== undefined ? is_active : true, req.params.id]
    );
    res.json({ success: true, message: 'Listing updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Admin: Delete listing
const deleteListing = async (req, res) => {
  try {
    await pool.query('DELETE FROM listings WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Listing deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Admin: Stats dashboard
const getDashboardStats = async (req, res) => {
  try {
    const [[{ userCount }]] = await pool.query('SELECT COUNT(*) as userCount FROM users WHERE role = "user"');
    const [[{ propCount }]] = await pool.query('SELECT COUNT(*) as propCount FROM properties');
    const [[{ recCount }]] = await pool.query('SELECT COUNT(*) as recCount FROM recommendations WHERE is_active = TRUE');
    const [[{ listCount }]] = await pool.query('SELECT COUNT(*) as listCount FROM listings WHERE is_active = TRUE');
    const [[{ pendingCount }]] = await pool.query('SELECT COUNT(*) as pendingCount FROM properties WHERE status = "pending"');
    res.json({ success: true, data: { userCount, propCount, recCount, listCount, pendingCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getListings, getListingById, createListing, updateListing, deleteListing, getDashboardStats };
