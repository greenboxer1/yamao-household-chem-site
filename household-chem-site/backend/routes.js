const express = require('express');
const router = express.Router();
const { Product, Category, Admin } = require('./models');
const { Op, Sequelize } = require('sequelize');
const { auth, generateAuthToken } = require('./auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'public/images');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ where: { username } });
    
    if (!admin || !(await admin.validPassword(password))) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }
    
    const token = generateAuthToken(admin);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Check admin auth status
router.get('/admin/me', auth, (req, res) => {
  res.json({ username: req.admin.username });
});

router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']] // Sort categories alphabetically
        });
        
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

router.get('/products', async (req, res) => {
    const { categoryId, priceFrom, priceTo, sortOrder, search, limit = 10, offset = 0 } = req.query;
    const where = {};
    
    // Фильтр по категории (игнорируем при поиске)
    if (categoryId && (!search || search.trim() === '')) {
        where.CategoryId = categoryId;
    }
    
    // Поиск по названию (регистронезависимый поиск по части названия)
    if (search && search.trim() !== '') {
        const searchTerm = search.trim();
        console.log('Search term received:', searchTerm);
        
        // Create a simple but effective search condition
        where[Op.and] = where[Op.and] || [];
        
        // Split search term into words and search for each word
        const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
        
        const searchConditions = searchWords.map(word => ({
            [Op.or]: [
                { name: { [Op.like]: `%${word}%` } },
                { name: { [Op.like]: `%${word.charAt(0).toUpperCase() + word.slice(1)}%` } }
            ]
        }));
        
        // Combine all search conditions with AND
        where[Op.and].push({
            [Op.and]: searchConditions
        });
        
        console.log('Search conditions:', JSON.stringify(where, null, 2));
    }
    
    // Фильтрация по цене (учитываем как discountPrice, так и обычную цену)
    if (priceFrom || priceTo) {
        where[Op.and] = where[Op.and] || [];
        
        const priceConditions = [];
        
        // Условие для минимальной цены
        if (priceFrom) {
            const minPrice = parseFloat(priceFrom);
            priceConditions.push({
                [Op.or]: [
                    { '$Product.price$': { [Op.gte]: minPrice } },
                    { '$Product.discountPrice$': { [Op.gte]: minPrice } }
                ]
            });
        }
        
        // Условие для максимальной цены
        if (priceTo) {
            const maxPrice = parseFloat(priceTo);
            priceConditions.push({
                [Op.or]: [
                    { '$Product.price$': { [Op.lte]: maxPrice } },
                    { '$Product.discountPrice$': { [Op.lte]: maxPrice } }
                ]
            });
        }
        
        // Добавляем все условия цены в основной where
        if (priceConditions.length > 0) {
            where[Op.and].push({
                [Op.and]: priceConditions
            });
        }
    }

    try {
        let order = [];
        if (sortOrder === 'asc' || sortOrder === 'desc') {
            // Сортировка по цене (учитываем скидочную цену, если она есть)
            order = [
                [
                    // Use COALESCE to prioritize discountPrice, fallback to price
                    Sequelize.literal('COALESCE(`Product`.`discountPrice`, `Product`.`price`)'),
                    sortOrder.toUpperCase()
                ]
            ];
        } else {
            // Default sorting
            order = [['id', 'ASC']];
        }

        // Build the query options
        const queryOptions = {
            where,
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                    required: false
                }
            ],
            // Add sorting if specified
            order: sortOrder ? order : [['id', 'ASC']],
            // Enable raw query to see what's being executed
            logging: (sql) => {
                console.log('Executing SQL:', sql);
            },
            // Force case-insensitive search
            collate: 'NOCASE',
            // Use subquery to improve performance
            subQuery: false
        };

        console.log('Query options:', JSON.stringify(queryOptions, null, 2));
        
        // Fetch products with pagination
        const { count, rows: products } = await Product.findAndCountAll({
            ...queryOptions,
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            distinct: true // Important for getting correct count with includes
        });
        
        console.log(`Found ${products.length} of ${count} total products matching the criteria`);
        
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin protected routes
router.use(auth);

// Get all products for admin
router.get('/admin/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [Category],
      order: [['id', 'ASC']]
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create or update product
router.post('/admin/products', upload.single('image'), async (req, res) => {
  try {
    const { id, name, price, discountPrice, weight, CategoryId } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : null;
    
    const productData = {
      name,
      price: parseFloat(price),
      weight,
      CategoryId: parseInt(CategoryId),
      ...(discountPrice && { discountPrice: parseFloat(discountPrice) }),
      ...(image && { image })
    };

    let product;
    if (id) {
      // Update existing product
      product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      // If new image is uploaded, delete the old one
      if (req.file && product.image) {
        const fs = require('fs');
        const path = require('path');
        const imagePath = path.join(__dirname, 'public', product.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      await product.update(productData);
    } else {
      // Create new product
      product = await Product.create(productData);
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ error: 'Failed to save product' });
  }
});

// Delete product
router.delete('/admin/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Delete the associated image if it exists
    if (product.image) {
      const fs = require('fs');
      const path = require('path');
      const imagePath = path.join(__dirname, 'public', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await product.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;