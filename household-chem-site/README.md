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

3. Build development server:
   ```
   npm run build
   ```

## Admin Access

A default admin account is created automatically with the following credentials:

- Username: `admin`
- Password: `admin`

**Important:** Change these credentials after the first login for security.

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
JWT_SECRET=your_jwt_secret_key
```
