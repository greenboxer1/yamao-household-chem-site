const { sequelize, Product, Category } = require('./models');

const categories = [
    {
        name: 'Средства для уборки',
        products: [
            { name: 'Универсальное чистящее средство', price: 150, weight: '500 мл' },
            { name: 'Средство для мытья полов', price: 180, weight: '1 л' },
            { name: 'Очиститель для стекол', price: 200, weight: '500 мл' },
            { name: 'Средство для чистки ковров', price: 250, weight: '500 мл' },
            { name: 'Полироль для мебели', price: 220, weight: '400 мл' },
            { name: 'Средство для чистки сантехники', price: 170, weight: '500 мл' },
            { name: 'Очиститель для духовки', price: 280, weight: '500 мл' },
            { name: 'Средство для мытья окон', price: 190, weight: '750 мл' },
            { name: 'Очиститель для кухонных поверхностей', price: 210, weight: '500 мл' },
            { name: 'Средство для удаления накипи', price: 230, weight: '500 мл' },
            { name: 'Пятновыводитель для тканей', price: 260, weight: '500 мл' },
            { name: 'Средство для чистки гриля', price: 290, weight: '400 мл' },
            { name: 'Очиститель для микроволновки', price: 180, weight: '400 мл' },
            { name: 'Средство для чистки кафеля', price: 200, weight: '750 мл' },
            { name: 'Очиститель для пластика', price: 170, weight: '500 мл' },
            { name: 'Средство для чистки кожаной мебели', price: 320, weight: '400 мл' },
            { name: 'Очиститель для мойки высокого давления', price: 350, weight: '1 л' },
            { name: 'Средство для чистки гриля барбекю', price: 280, weight: '500 мл' },
            { name: 'Очиститель для вытяжки', price: 240, weight: '400 мл' },
            { name: 'Средство для удаления жира', price: 210, weight: '500 мл' }
        ]
    },
    {
        name: 'Средства для стирки',
        products: [
            { name: 'Стиральный порошок для цветного белья', price: 300, weight: '3 кг' },
            { name: 'Гель для стирки черного белья', price: 280, weight: '1.5 л' },
            { name: 'Кондиционер для белья', price: 220, weight: '1 л' },
            { name: 'Отбеливатель', price: 150, weight: '1 л' },
            { name: 'Пятновыводитель для белого белья', price: 190, weight: '500 мл' },
            { name: 'Средство для стирки детского белья', price: 320, weight: '2.4 кг' },
            { name: 'Капсулы для стирки', price: 450, weight: '15 шт' },
            { name: 'Гель для стирки шерсти', price: 280, weight: '1 л' },
            { name: 'Средство для замачивания белья', price: 200, weight: '1.5 л' },
            { name: 'Кондиционер-ополаскиватель', price: 180, weight: '1 л' },
            { name: 'Средство для стирки спортивной одежды', price: 350, weight: '1 л' },
            { name: 'Пятновыводитель для цветных тканей', price: 210, weight: '500 мл' },
            { name: 'Гель для стирки черных вещей', price: 290, weight: '1.5 л' },
            { name: 'Средство для стирки деликатных тканей', price: 270, weight: '1 л' },
            { name: 'Отбеливающий гель', price: 230, weight: '1 л' },
            { name: 'Кондиционер с ароматом лаванды', price: 190, weight: '1 л' },
            { name: 'Средство для стирки в холодной воде', price: 260, weight: '2.7 кг' },
            { name: 'Гель для стирки белого белья', price: 240, weight: '1.5 л' },
            { name: 'Средство для удаления запахов', price: 310, weight: '500 мл' },
            { name: 'Экологичное средство для стирки', price: 380, weight: '1.5 л' }
        ]
    }
];

async function seed() {
    try {
        // Синхронизация моделей с базой данных
        await sequelize.sync({ force: true });
        console.log('Database synchronized');

        // Создание категорий и товаров
        for (const categoryData of categories) {
            const category = await Category.create({
                name: categoryData.name
            });

            for (const productData of categoryData.products) {
                await Product.create({
                    ...productData,
                    CategoryId: category.id,
                    discountPrice: Math.random() > 0.7 ? 
                        Math.round(productData.price * (0.7 + Math.random() * 0.2)) : 
                        null
                });
            }
            
            console.log(`Added category: ${category.name} with ${categoryData.products.length} products`);
        }

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
