const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./mongodb');

// Function to generate a token with email included
function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email, // Ensure email is included
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h', // Set an appropriate expiration time
  });
}

async function verifyAuth(req) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Full Decoded Token:', decoded);

    const { db } = await connectToDatabase();
    const user = await db.collection('candidates').findOne({ email: decoded.email });

    if (!user) {
      console.error('User not found for email:', decoded.email);
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('Auth Verification Error:', error);
    throw new Error('Authentication failed');
  }
}

async function verifyAdmin(req) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Full Decoded Token:', decoded);

    const { db } = await connectToDatabase();
    const user = await db.collection('candidates').findOne({ email: decoded.email });

    if (!user) {
      console.error('User not found for email:', decoded.email);
      throw new Error('User not found');
    }

    // Additional admin verification logic can be added here

    return user;
  } catch (error) {
    console.error('Auth Verification Error:', error);
    throw new Error('Authentication failed');
  }
}

module.exports = { verifyAuth, verifyAdmin, generateToken };