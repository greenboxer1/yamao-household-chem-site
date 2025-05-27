require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./routes');
const { sequelize } = require('./models');
const { startBackupProcess } = require('./db_backups');

const app = express();
const port = 3000;

// Debug: Log frontend path
console.log('Frontend path:', path.join(__dirname, '../frontend/dist'));

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Handle preflight requests
app.options('*', cors(corsOptions));
app.use('/api', routes);
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Serve static files from frontend build
const frontendPath = path.join(__dirname, '../frontend/dist');
console.log('Serving frontend from:', frontendPath);

// Check if frontend build exists
const indexPath = path.join(frontendPath, 'index.html');
if (!require('fs').existsSync(indexPath)) {
  console.error('Frontend build not found at:', indexPath);
  console.error('Please run `npm run build` in the frontend directory');
  process.exit(1);
}

// Serve static files with error handling
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Skip logging for known non-existent files
  if (req.path.includes('placeholder.jpg')) {
    return res.status(404).end();
  }
  
  // Log the request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  // Check if file exists before serving
  const filePath = path.join(frontendPath, req.path);
  require('fs').stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // Skip to next middleware if file doesn't exist
      return next();
    }
    // Serve the file if it exists
    express.static(frontendPath)(req, res, next);
  });
});

// Handle SPA (Single Page Application) routing
app.get('*', (req, res) => {
  // Don't serve HTML for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  console.log(`[${new Date().toISOString()}] Serving index.html for ${req.path}`);
  
  // Send the main HTML file
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error loading the application');
    }
  });
});

// Initialize database with default data
sequelize.sync().then(async () => {
  const { Category, Product, Admin } = require('./models');
  
  // Create default categories and products if none exist
  const categoryCount = await Category.count();
  if (categoryCount === 0) {
    const cat1 = await Category.create({ name: 'Чистящие средства' });
    const cat2 = await Category.create({ name: 'Моющие средства' });
    await Product.create({ name: 'Универсальный очиститель', price: 5.99, weight: '500мл', image: '/images/placeholder.svg', CategoryId: cat1.id });
    await Product.create({ name: 'Очиститель стекол', price: 4.99, discountPrice: 3.99, weight: '750мл', image: '/images/placeholder.svg', CategoryId: cat1.id });
    await Product.create({ name: 'Стиральный порошок', price: 10.99, weight: '2кг', image: '/images/placeholder.svg', CategoryId: cat2.id });
    await Product.create({ name: 'Жидкость для посуды', price: 3.99, weight: '1л', image: '/images/placeholder.svg', CategoryId: cat2.id });
  }
  
  // Create default admin user if none exists
  const adminCount = await Admin.count();
  if (adminCount === 0) {
    await Admin.create({
      username: 'admin',
      password: 'admin123' // In production, use a more secure password
    });
    console.log('Default admin user created. Username: admin, Password: admin');
  }
});

// Start the server and database backup process
let stopBackupProcess;

const server = app.listen(port, async () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  
  try {
    stopBackupProcess = await startBackupProcess();
  } catch (err) {
    console.error('Failed to start backup process:', err);
  }
});