const Department = require('../models/Department');
const Doctor = require('../models/Doctor');

// @desc    Get all departments (with doctor count)
// @route   GET /api/departments
// @access  Public
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true }).sort({ name: 1 });

    // Aggregate doctor count per department
    const doctorCounts = await Doctor.aggregate([
      { $match: { isApproved: true, isActive: true } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    doctorCounts.forEach((dc) => {
      if (dc._id) countMap[dc._id.toLowerCase()] = dc.count;
    });

    const enriched = departments.map((dept) => ({
      ...dept.toObject(),
      doctorCount: countMap[dept.name.toLowerCase()] || 0
    }));

    return res.json(enriched);
  } catch (error) {
    console.error('getDepartments error:', error);
    return res.status(500).json({ message: error.message || 'Error fetching departments' });
  }
};

// @desc    Get single department with its doctors
// @route   GET /api/departments/:id
// @access  Public
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const doctors = await Doctor.find({
      department: new RegExp(`^${department.name}$`, 'i'),
      isApproved: true,
      isActive: true
    });

    return res.json({
      department,
      doctors
    });
  } catch (error) {
    console.error('getDepartmentById error:', error);
    return res.status(500).json({ message: error.message || 'Error fetching department' });
  }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private (Admin)
const createDepartment = async (req, res) => {
  try {
    const { name, description, icon, image } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Department name is required' });
    }

    const exists = await Department.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
    if (exists) {
      return res.status(400).json({ message: 'A department with this name already exists' });
    }

    const department = await Department.create({
      name: name.trim(),
      description: description || '',
      icon: icon || 'bi-hospital',
      image: image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
    });

    return res.status(201).json(department);
  } catch (error) {
    console.error('createDepartment error:', error);
    return res.status(500).json({ message: error.message || 'Error creating department' });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin)
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const { name, description, icon, image, isActive } = req.body;
    if (name) department.name = name;
    if (description !== undefined) department.description = description;
    if (icon !== undefined) department.icon = icon;
    if (image !== undefined) department.image = image;
    if (isActive !== undefined) department.isActive = isActive;

    const updated = await department.save();
    return res.json(updated);
  } catch (error) {
    console.error('updateDepartment error:', error);
    return res.status(500).json({ message: error.message || 'Error updating department' });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.deleteOne();
    return res.json({ message: 'Department removed successfully' });
  } catch (error) {
    console.error('deleteDepartment error:', error);
    return res.status(500).json({ message: error.message || 'Error deleting department' });
  }
};

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
