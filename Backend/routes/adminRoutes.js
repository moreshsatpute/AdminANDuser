const express = require('express');
const { getAllUsers, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/users', protect, admin, getAllUsers);
router.delete('/user/:id', protect, admin, deleteUser);

module.exports = router;
