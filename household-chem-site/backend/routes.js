const express = require('express');
const router = express.Router();
const { Product, Category } = require('./models');
const { Op, Sequelize } = require('sequelize');

router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']] // Sort categories alphabetically
        });
        
        // Add 'All' category at the beginning
        res.json([
            { id: 'all', name: 'Все' },
            ...categories
        ]);
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
        
        const products = await Product.findAll(queryOptions);
        console.log(`Found ${products.length} products matching the criteria`);
        
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;