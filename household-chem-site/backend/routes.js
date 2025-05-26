const express = require('express');
const router = express.Router();
const { sequelize, Product, Category, Admin } = require('./models');
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

// Data directory and file for promotional banners
const dataDir = path.join(__dirname, 'data');
const bannersFilePath = path.join(dataDir, 'promotional_banners.json');
const contactInfoFilePath = path.join(dataDir, 'contactInfo.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper function to read banners data
const readBannersData = () => {
  if (!fs.existsSync(bannersFilePath)) {
    // Create default banners file if it doesn't exist
    const defaultBanners = { banner1Url: null, banner2Url: null };
    fs.writeFileSync(bannersFilePath, JSON.stringify(defaultBanners, null, 2));
    return defaultBanners;
  }
  try {
    const data = fs.readFileSync(bannersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading banners file:', error);
    return { banner1Url: null, banner2Url: null }; // Fallback
  }
};

// Helper function to write banners data
const writeBannersData = (data) => {
  try {
    fs.writeFileSync(bannersFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing banners file:', error);
  }
};

// Helper function to read contact info data
const readContactInfoData = () => {
  if (!fs.existsSync(contactInfoFilePath)) {
    // Create default contact info file if it doesn't exist
    const defaultContactInfo = {
      phone: "",
      email: "",
      vkUrl: "",
      telegramUrl: "",
      whatsappUrl: ""
    };
    fs.writeFileSync(contactInfoFilePath, JSON.stringify(defaultContactInfo, null, 2));
    return defaultContactInfo;
  }
  try {
    const data = fs.readFileSync(contactInfoFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contact info file:', error);
    return { phone: "", email: "", vkUrl: "", telegramUrl: "", whatsappUrl: "" }; // Fallback
  }
};

// Helper function to write contact info data
const writeContactInfoData = (data) => {
  try {
    fs.writeFileSync(contactInfoFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing contact info file:', error);
  }
};

// --- Public Route for Promotional Banners ---
router.get('/promotional-banners', (req, res) => {
  const banners = readBannersData();
  res.json(banners);
});

// --- Public Route for Contact Info ---
router.get('/contact-info', (req, res) => {
  const contactInfo = readContactInfoData();
  res.json(contactInfo);
});

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

// Category management routes
router.get('/admin/categories', auth, async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/admin/categories', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.put('/admin/categories/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    await category.update({ name });
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/admin/categories/:id', auth, async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, { transaction });
    
    if (!category) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Find all products with this category
    const products = await Product.findAll({
      where: { CategoryId: id },
      transaction
    });
    
    // Update all products to remove the category reference
    await Promise.all(products.map(product => 
      product.update({ CategoryId: null }, { transaction })
    ));
    
    // Now it's safe to delete the category
    await category.destroy({ transaction });
    
    // Commit the transaction
    await transaction.commit();
    
    res.json({ 
      success: true, 
      updatedProductsCount: products.length
    });
  } catch (error) {
    // If anything fails, rollback the transaction
    await transaction.rollback();
    console.error('Error deleting category:', error);
    res.status(500).json({ 
      error: 'Failed to delete category',
      details: error.message 
    });
  }
});

// --- Admin Routes for Promotional Banners ---

// Upload/Update Banner for Slot 1
router.post('/admin/promotional-banners/upload/slot1', auth, upload.single('bannerImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded for Banner 1.' });
  }

  try {
    const bannersData = readBannersData();
    const oldImageUrl = bannersData.banner1Url;

    // Delete old image if it exists
    if (oldImageUrl) {
      const oldImagePath = path.join(__dirname, 'public', oldImageUrl);
      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
          console.log(`Deleted old banner 1 image: ${oldImagePath}`);
        } catch (unlinkError) {
          console.error(`Error deleting old banner 1 image ${oldImagePath}:`, unlinkError);
          // Continue even if deletion fails, to not block new image upload
        }
      }
    }

    const newImageUrl = `/images/${req.file.filename}`;
    bannersData.banner1Url = newImageUrl;
    writeBannersData(bannersData);

    res.json({ message: 'Banner 1 uploaded successfully.', imageUrl: newImageUrl });
  } catch (error) {
    console.error('Error uploading Banner 1:', error);
    res.status(500).json({ error: 'Failed to upload Banner 1.' });
  }
});

// Upload/Update Banner for Slot 2
router.post('/admin/promotional-banners/upload/slot2', auth, upload.single('bannerImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded for Banner 2.' });
  }

  try {
    const bannersData = readBannersData();
    const oldImageUrl = bannersData.banner2Url;

    // Delete old image if it exists
    if (oldImageUrl) {
      const oldImagePath = path.join(__dirname, 'public', oldImageUrl);
      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
          console.log(`Deleted old banner 2 image: ${oldImagePath}`);
        } catch (unlinkError) {
          console.error(`Error deleting old banner 2 image ${oldImagePath}:`, unlinkError);
        }
      }
    }

    const newImageUrl = `/images/${req.file.filename}`;
    bannersData.banner2Url = newImageUrl;
    writeBannersData(bannersData);

    res.json({ message: 'Banner 2 uploaded successfully.', imageUrl: newImageUrl });
  } catch (error) {
    console.error('Error uploading Banner 2:', error);
    res.status(500).json({ error: 'Failed to upload Banner 2.' });
  }
});

// --- Admin Route for Contact Info ---
router.put('/admin/contact-info', async (req, res) => { 
  try {
    const { phone, email, vkUrl, telegramUrl, whatsappUrl } = req.body;
    
    // Basic validation (can be more extensive)
    if (typeof phone !== 'string' || typeof email !== 'string' || 
        typeof vkUrl !== 'string' || typeof telegramUrl !== 'string' || 
        typeof whatsappUrl !== 'string') {
      return res.status(400).json({ error: 'All contact fields must be strings.' });
    }

    const newContactInfo = {
      phone,
      email,
      vkUrl,
      telegramUrl,
      whatsappUrl
    };

    writeContactInfoData(newContactInfo);
    res.json({ message: 'Contact information updated successfully.', contactInfo: newContactInfo });
  } catch (error) {
    console.error('Error updating contact information:', error);
    res.status(500).json({ error: 'Failed to update contact information.' });
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
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('File:', req.file);
    
    const { id, name, price, discountPrice, weight, categoryId, CategoryId } = req.body;
    // Используем CategoryId или categoryId (поддерживаем оба варианта)
    const finalCategoryId = CategoryId || categoryId;
    const image = req.file ? `/images/${req.file.filename}` : null;
    
    // Prepare product data with proper type conversion
    const productData = {
      name,
      price: parseFloat(price),
      weight,
      ...(finalCategoryId && { CategoryId: parseInt(finalCategoryId) }), // Используем finalCategoryId
      ...(discountPrice && { discountPrice: parseFloat(discountPrice) }),
      ...(image && { image })
    };
    
    console.log('Processed product data:', JSON.stringify(productData, null, 2));

    let product;
    if (id) {
      // Update existing product
      product = await Product.findByPk(id, { include: [Category] });
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
      
      // Update the product with new data
      await product.update(productData);
      
      // If category was provided, ensure the association is updated
      if (finalCategoryId) {
        console.log('Updating category to:', finalCategoryId);
        const category = await Category.findByPk(parseInt(finalCategoryId));
        if (category) {
          console.log('Found category:', category.name);
          await product.setCategory(category);
          // Обновляем объект продукта с новой категорией для ответа
          product.Category = category;
        } else {
          console.log('Category not found with id:', finalCategoryId);
        }
      }
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