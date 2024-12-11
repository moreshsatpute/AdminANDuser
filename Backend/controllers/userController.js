const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Secret key for JWT signing (replace with a secure key in production)
const JWT_SECRET = 'your_jwt_secret_key';

// Function to generate a JWT token
const generateJWTToken = (id, role) => {
  try {
    console.log('Generating JWT token for user:', { id, role });
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' });
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw error;
  }
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;  // Add role to destructuring

  console.log('Received registration request:', { name, email, role });
  console.log('Received registration request=============>:', req.body);

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Registration failed: User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user with the plain text password and role (if provided)
    const user = await User.create({
      name,
      email,
      password, // Store the password as is (plain text)
      role: role || 'user', // Default to 'user' if no role is provided
    });

    if (user) {
      // Generate JWT token with user role
      const token = generateJWTToken(user._id, user.role);
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Login an existing user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request:', { email });

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the plain text passwords
    if (password !== user.password) {
      console.log('Login failed: Incorrect password');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateJWTToken(user._id, user.role);
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };
