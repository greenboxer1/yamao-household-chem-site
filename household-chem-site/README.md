# Household Chemicals Catalog with Admin Panel

This is a simple household chemicals catalog with an admin panel for managing products.

## Features

- View products with filtering and sorting
- Admin panel for managing products
- User authentication (admin only)
- Image uploads for products
- Responsive design

## Setup

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
   The server will start on http://localhost:3000

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The frontend will be available at http://localhost:5173

## Admin Access

A default admin account is created automatically with the following credentials:

- Username: `admin`
- Password: `admin123`

**Important:** Change these credentials after the first login for security.

## API Endpoints

### Admin

- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Check admin authentication status
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create/update product (admin)
- `DELETE /api/admin/products/:id` - Delete product (admin)

### Public

- `GET /api/categories` - Get all categories
- `GET /api/products` - Get products with filters

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
JWT_SECRET=your_jwt_secret_key
```

## Security Notes

- Always use HTTPS in production
- Change default admin credentials
- Keep your dependencies up to date
- Use environment variables for sensitive information
