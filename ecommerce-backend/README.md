# E-commerce Backend API

A complete Node.js/Express backend for an e-commerce platform with MongoDB, JWT authentication, and bKash sandbox payment integration.

## Features
- **Authentication**: JWT, bcrypt password hashing.
- **Roles**: Admin and User roles for different permissions.
- **Product Management**: CRUD for products (Admin only).
- **Cart Management**: Add, remove, update quantity.
- **Order Management**: Place orders, view my orders, view all (admin), update status (admin).
- **Payment**: bKash Tokenized Checkout Sandbox integration.
- **File Uploads**: Local image storage using Multer.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB instance running (local or Atlas)

### 1. Install Dependencies
Navigate to the project root and run:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` or just open the existing `.env` file and set the credentials:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your_jwt_secret_here
BKASH_USERNAME=sandboxTokenizedUser02
BKASH_PASSWORD=sandboxTokenizedUser02@12345
BKASH_APP_KEY=your_sandbox_app_key
BKASH_APP_SECRET=your_sandbox_app_secret
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta
FRONTEND_URL=http://localhost:3000
```

### 3. Create Uploads Folder
Create an empty `uploads` directory at the root:
```bash
mkdir uploads
```

### 4. Run the Server
```bash
# Development mode with nodemon (if installed) or node
node server.js
```
The server will start at `http://localhost:5000`

## API Endpoints Overview

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`
- **Products**: `GET /api/products`, `POST /api/products` (admin)
- **Cart**: `GET /api/cart`, `POST /api/cart`
- **Orders**: `POST /api/orders`, `GET /api/orders/my`
- **Payment**: `POST /api/payment/bkash/create`, `POST /api/payment/bkash/execute`
- **Uploads**: `POST /api/upload` (returns path to image)
