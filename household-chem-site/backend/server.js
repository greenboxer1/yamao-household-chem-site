const express = require('express');
const path = require('path');
const routes = require('./routes');
const { sequelize } = require('./models');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', routes);
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

sequelize.sync().then(async () => {
  const { Category, Product } = require('./models');
  const count = await Category.count();
  if (count === 0) {
    const cat1 = await Category.create({ name: 'Чистящие средства' });
    const cat2 = await Category.create({ name: 'Моющие средства' });
    await Product.create({ name: 'Универсальный очиститель', price: 5.99, weight: '500мл', image: '/images/placeholder.svg', CategoryId: cat1.id });
    await Product.create({ name: 'Очиститель стекол', price: 4.99, discountPrice: 3.99, weight: '750мл', image: '/images/placeholder.svg', CategoryId: cat1.id });
    await Product.create({ name: 'Стиральный порошок', price: 10.99, weight: '2кг', image: '/images/placeholder.svg', CategoryId: cat2.id });
    await Product.create({ name: 'Жидкость для посуды', price: 3.99, weight: '1л', image: '/images/placeholder.svg', CategoryId: cat2.id });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});