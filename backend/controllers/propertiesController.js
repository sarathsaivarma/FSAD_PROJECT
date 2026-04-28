const pool = require('../config/db');

// User: Submit a property
const createProperty = async (req, res) => {
  try {
    const { title, property_type, bhk, area_sqft, city, locality, age_years, current_condition, budget_for_improvement, goals } = req.body;
    if (!title || !property_type || !city) {
      return res.status(400).json({ success: false, message: 'title, property_type and city are required.' });
    }
    const [result] = await pool.query(
      `INSERT INTO properties (user_id, title, property_type, bhk, area_sqft, city, locality, age_years, current_condition, budget_for_improvement, goals)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, property_type, bhk, area_sqft, city, locality, age_years || 0, current_condition || 'Average', budget_for_improvement || 0, goals]
    );
    const propertyId = result.insertId;
    // Auto-generate personalized recommendations based on budget and condition
    await generatePersonalizedRecs(propertyId, budget_for_improvement || 0, current_condition || 'Average', req.body);
    res.status(201).json({ success: true, message: 'Property submitted successfully.', id: propertyId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Auto-generate recommendations
const generatePersonalizedRecs = async (propertyId, budget, condition, propertyData) => {
  try {
    let priorityFilter = 'High';
    if (condition === 'Poor') priorityFilter = 'High';
    else if (condition === 'Average') priorityFilter = 'Medium';
    else priorityFilter = 'Low';

    // Fetch recommendations that fit within budget
    const [recs] = await pool.query(
      `SELECT id, estimated_cost_max, roi_percentage FROM recommendations 
       WHERE is_active = TRUE AND estimated_cost_max <= ? 
       ORDER BY roi_percentage DESC LIMIT 10`,
      [budget > 0 ? budget : 999999]
    );
    const inserts = recs.map((r, i) => [propertyId, r.id, i < 3 ? 'High' : i < 6 ? 'Medium' : 'Low', 'Auto-generated based on property profile']);
    if (inserts.length > 0) {
      await pool.query('INSERT IGNORE INTO property_recommendations (property_id, recommendation_id, priority, notes) VALUES ?', [inserts]);
    }
  } catch (e) { console.error('Rec gen error', e); }
};

// User: Get their own properties
const getUserProperties = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM properties WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Get single property with its recommendations
const getPropertyWithRecs = async (req, res) => {
  try {
    const [props] = await pool.query('SELECT * FROM properties WHERE id = ?', [req.params.id]);
    if (props.length === 0) return res.status(404).json({ success: false, message: 'Property not found.' });
    const prop = props[0];
    // Check ownership unless admin
    if (req.user.role !== 'admin' && prop.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    const [recs] = await pool.query(
      `SELECT pr.*, r.title, r.description, r.estimated_cost_min, r.estimated_cost_max, r.roi_percentage, r.difficulty, r.time_required, r.tags, c.name as category_name
       FROM property_recommendations pr
       JOIN recommendations r ON pr.recommendation_id = r.id
       JOIN categories c ON r.category_id = c.id
       WHERE pr.property_id = ?
       ORDER BY FIELD(pr.priority, 'High', 'Medium', 'Low')`,
      [req.params.id]
    );
    res.json({ success: true, data: { property: prop, recommendations: recs } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Admin: Get all properties
const getAllProperties = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, u.name as user_name, u.email as user_email
       FROM properties p JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Admin: Update property status
const updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE properties SET status = ?, updated_at = NOW() WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Status updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { createProperty, getUserProperties, getPropertyWithRecs, getAllProperties, updatePropertyStatus };
