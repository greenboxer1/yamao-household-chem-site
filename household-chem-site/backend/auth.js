const jwt = require('jsonwebtoken');
const { Admin } = require('./models');

const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id);
    if (!admin) {
      throw new Error();
    }
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const generateAuthToken = (admin) => {
  return jwt.sign({ id: admin.id.toString() }, JWT_SECRET);
};

module.exports = { auth, generateAuthToken };
