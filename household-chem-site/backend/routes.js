const express = require('express');
const router = express.Router();
const { Product, Category } = require('./models');
const { Op } = require('sequelize');

router.get('/categories', async (req, res) => {
    const categories = await Category.findAll();
    res.json(categories);
});

router.get('/products', async (req, res) => {
    const { categoryId, priceFrom, priceTo, sortOrder, limit = 10, offset = 0 } = req.query;
    const where = {};
    if (categoryId) where.CategoryId = categoryId;

    // Фильтрация по цене (сначала discountPrice, затем price)
    if (priceFrom || priceTo) {
        where[Op.or] = [
            { discountPrice: { [Op.and]: [
                priceFrom ? { [Op.gte]: priceFrom } : {},
                priceTo ? { [Op.lte]: priceTo } : {}
            ]}},
            { 
                discountPrice: null,
                price: { [Op.and]: [
                    priceFrom ? { [Op.gte]: priceFrom } : {},
                    priceTo ? { [Op.lte]: priceTo } : {}
                ]}
            }
        ];
    }

    const order = sortOrder ? [[Sequelize.literal('COALESCE(discountPrice, price)'), sortOrder.toUpperCase()]] : [];

    const products = await Product.findAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order
    });
    res.json(products);
});

module.exports = router;