const request = require('supertest');
const express = require('express');
const fs = require('fs');

// --- Тестовые данные ---
const mockProducts = [{ id: 1, name: 'Тестовый продукт 1', price: 100, weight: '1кг', image: 'test.jpg', CategoryId: 1 }];
const mockCategories = [{ id: 1, name: 'Тестовая категория 1' }];
const mockBannersData = { banner1Url: '/images/test-banner.jpg', banner2Url: null };
const mockContactInfoData = { phone: '8-800-555-35-35', email: 'test@yamao.com' };

// --- Моки ---

// Мокируем 'fs' для эндпоинтов, работающих с файлами
jest.mock('fs');

// Мокируем './models.js' чтобы избежать обращения к реальной БД
jest.mock('./models', () => ({
  sequelize: { // Мокируем экземпляр sequelize, если он где-то используется напрямую
    transaction: jest.fn(() => Promise.resolve({ commit: jest.fn(), rollback: jest.fn() })),
  },
  Product: {
    findAndCountAll: jest.fn().mockResolvedValue({ count: mockProducts.length, rows: mockProducts }),
    findAll: jest.fn().mockResolvedValue(mockProducts),
  },
  Category: {
    findAll: jest.fn().mockResolvedValue(mockCategories),
  },
  Admin: { // Пустой мок для модели Admin, так как мы не тестируем защищенные роуты
    findOne: jest.fn(),
  }
}));

// --- Настройка тестов ---

// Загружаем роуты ПОСЛЕ того, как моки были настроены
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('API Endpoints', () => {

  beforeEach(() => {
    // Сбрасываем все моки перед каждым тестом, чтобы тесты были изолированы
    jest.clearAllMocks();

    // Настраиваем мок файловой системы
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.endsWith('promotional_banners.json')) {
        return JSON.stringify(mockBannersData);
      }
      if (filePath.endsWith('contactInfo.json')) {
        return JSON.stringify(mockContactInfoData);
      }
      return '';
    });
    fs.existsSync.mockReturnValue(true);
  });

  // --- Тесты ---

  test('GET /api/products должен вернуть список продуктов из мока', async () => {
    // Настраиваем мок для этого конкретного теста
    const { Product } = require('./models');
    Product.findAndCountAll.mockResolvedValue({ count: mockProducts.length, rows: mockProducts });

    const response = await request(app).get('/api/products');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockProducts);
    expect(Product.findAndCountAll).toHaveBeenCalledTimes(1);
  });

  test('GET /api/categories должен вернуть список категорий из мока', async () => {
    const { Category } = require('./models');
    Category.findAll.mockResolvedValue(mockCategories);

    const response = await request(app).get('/api/categories');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockCategories);
    expect(Category.findAll).toHaveBeenCalledTimes(1);
  });

  test('GET /api/promotional-banners должен вернуть данные из мока JSON', async () => {
    const response = await request(app).get('/api/promotional-banners');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockBannersData);
    expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('promotional_banners.json'), 'utf-8');
  });

  test('GET /api/contact-info должен вернуть данные из мока JSON', async () => {
    const response = await request(app).get('/api/contact-info');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockContactInfoData);
    expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('contactInfo.json'), 'utf-8');
  });
});
