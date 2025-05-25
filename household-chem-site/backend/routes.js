const express = require('express');
const router = express.Router();
const { Product, Category } = require('./models');
const { Op, Sequelize } = require('sequelize');

router.get('/categories', async (req, res) => {
    const categories = await Category.findAll();
    res.json(categories);
});

router.get('/products', async (req, res) => {
    const { categoryId, priceFrom, priceTo, sortOrder, search, limit = 10, offset = 0 } = req.query;
    const where = {};
    
    // Фильтр по категории
    if (categoryId) where.CategoryId = categoryId;
    
    // Поиск по названию (регистронезависимый поиск по части названия)
    if (search && search.trim() !== '') {
        const searchTerm = `%${search.trim().toLowerCase()}%`;
        console.log('Search term received:', searchTerm);
        
        where[Op.and] = where[Op.and] || [];
        
        // Use parameterized query to prevent SQL injection
        where[Op.and].push(
            Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('Product.name')),
                'LIKE',
                searchTerm
            )
        );
    }
    
    console.log('Final WHERE clause:', JSON.stringify(where, null, 2));
    
    // Фильтрация по цене (учитываем как discountPrice, так и обычную цену)
    const priceConditions = [];
    
    // Условие для товаров со скидкой
    const discountPriceCondition = {};
    if (priceFrom) discountPriceCondition[Op.gte] = parseFloat(priceFrom);
    if (priceTo) discountPriceCondition[Op.lte] = parseFloat(priceTo);
    
    // Условие для товаров без скидки
    const regularPriceCondition = {};
    if (priceFrom) regularPriceCondition[Op.gte] = parseFloat(priceFrom);
    if (priceTo) regularPriceCondition[Op.lte] = parseFloat(priceTo);
    
    if (priceFrom || priceTo) {
        where[Op.or] = [
            // Товары со скидкой
            {
                discountPrice: { [Op.ne]: null },
                ...(Object.keys(discountPriceCondition).length > 0 && { 
                    discountPrice: discountPriceCondition 
                })
            },
            // Товары без скидки
            {
                discountPrice: null,
                ...(Object.keys(regularPriceCondition).length > 0 && { 
                    price: regularPriceCondition 
                })
            }
        ];
    }

    try {
        let order = [];
        if (sortOrder) {
            // Сортировка по цене (учитываем скидочную цену, если она есть)
            order = [
                [
                    Sequelize.fn('COALESCE', 
                        Sequelize.col('Product.discountPrice'), 
                        Sequelize.col('Product.price')
                    ),
                    sortOrder.toUpperCase()
                ]
            ];
        } else {
            // Сортировка по умолчанию (можно изменить на нужное поле)
            order = [['id', 'ASC']];
        }

        const products = await Product.findAll({
            where,
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            order,
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name']
                }
            ],
            // Сортировка по умолчанию (по id, можно изменить на нужное поле)
            order: sortOrder ? undefined : [['id', 'ASC']]
        });
        
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;