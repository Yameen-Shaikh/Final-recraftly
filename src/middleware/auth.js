const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
  console.log('Protect middleware hit!');
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token found:', token);
  }

  if (!token) {
    console.log('No token found.');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload to request
    console.log('Token decoded. User:', req.user);
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const authorizeAdmin = (req, res, next) => {
  console.log('AuthorizeAdmin middleware hit!');
  if (req.user && req.user.role === 'admin') {
    console.log('User is admin. Proceeding.');
    next();
  } else {
    console.log('User is not admin or req.user is missing.', req.user);
    res.status(403).json({ message: 'Access denied, not an admin' });
  }
};

module.exports = {
  protect,
  authorizeAdmin
};