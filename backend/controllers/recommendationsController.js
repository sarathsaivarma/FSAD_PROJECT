const pool = require('../config/db');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Get all recommendations (with optional category filter)
const getRecommendations = async (req, res) => {
  try {
    const { category_id, difficulty, search } = req.query;
    let query = `
      SELECT r.*, c.name as category_name, c.icon as category_icon
      FROM recommendations r
      JOIN categories c ON r.category_id = c.id
      WHERE r.is_active = TRUE
    `;
    const params = [];
    if (category_id) { query += ' AND r.category_id = ?'; params.push(category_id); }
    if (difficulty) { query += ' AND r.difficulty = ?'; params.push(difficulty); }
    if (search) { query += ' AND (r.title LIKE ? OR r.description LIKE ? OR r.tags LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    query += ' ORDER BY r.roi_percentage DESC';
    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Get single recommendation
const getRecommendationById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, c.name as category_name FROM recommendations r JOIN categories c ON r.category_id = c.id WHERE r.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Admin: Create recommendation
const createRecommendation = async (req, res) => {
  try {
    const { category_id, title, description, estimated_cost_min, estimated_cost_max, roi_percentage, difficulty, time_required, tags } = req.body;
    if (!category_id || !title || !description) {
      return res.status(400).json({ success: false, message: 'category_id, title, and description are required.' });
    }
    const [result] = await pool.query(
      `INSERT INTO recommendations (category_id, title, description, estimated_cost_min, estimated_cost_max, roi_percentage, difficulty, time_required, tags, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, title, description, estimated_cost_min || 0, estimated_cost_max || 0, roi_percentage || 0, difficulty || 'Medium', time_required || '', tags || '', req.user.id]
    );
    res.status(201).json({ success: true, message: 'Recommendation created.', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Admin: Update recommendation
const updateRecommendation = async (req, res) => {
  try {
    const { category_id, title, description, estimated_cost_min, estimated_cost_max, roi_percentage, difficulty, time_required, tags, is_active } = req.body;
    await pool.query(
      `UPDATE recommendations SET category_id=?, title=?, description=?, estimated_cost_min=?, estimated_cost_max=?, roi_percentage=?, difficulty=?, time_required=?, tags=?, is_active=?, updated_at=NOW() WHERE id=?`,
      [category_id, title, description, estimated_cost_min, estimated_cost_max, roi_percentage, difficulty, time_required, tags, is_active !== undefined ? is_active : true, req.params.id]
    );
    res.json({ success: true, message: 'Recommendation updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Admin: Delete recommendation
const deleteRecommendation = async (req, res) => {
  try {
    await pool.query('DELETE FROM recommendations WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Recommendation deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getCategories, getRecommendations, getRecommendationById, createRecommendation, updateRecommendation, deleteRecommendation };
