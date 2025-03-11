# Saree Website

A full-stack e-commerce website for selling traditional Indian sarees.

## Features

- **Product Catalog**: Browse sarees by category with filtering options
- **Product Details**: View detailed information about each saree
- **Shopping Cart**: Add products to cart and manage quantities
- **Wishlist**: Save favorite products for later
- **Checkout**: Complete purchases with a simple checkout process
- **Admin Dashboard**: Manage products (add, edit, delete)
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

### Frontend

- React with TypeScript
- Material UI for component styling
- React Router for navigation
- Context API for state management

### Backend

- Node.js with Express
- SQLite database
- Multer for file uploads
- Express Validator for input validation
- Winston for logging
- Node Cache for performance optimization

## Project Structure

```
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   │   └── images/         # Product images
│   └── src/                # React source code
│       ├── components/     # Reusable UI components
│       ├── context/        # React context providers
│       ├── pages/          # Page components
│       └── utils/          # Utility functions
│
├── server/                 # Backend Node.js application
│   ├── controllers/        # Request handlers
│   ├── db/                 # Database files
│   ├── middleware/         # Express middleware
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts
│   └── utils/              # Helper functions
│
└── logs/                   # Application logs
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd saree-website
   ```

2. Install server dependencies:

   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

### Running the Application

1. Start the backend server:

   ```
   cd server
   npm run dev
   ```

2. Start the frontend development server:

   ```
   cd client
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Environment Variables

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
NODE_ENV=development
DB_PATH=./db/saree.db
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## API Endpoints

### Products

- `GET /api/products` - Get all products with optional filtering
- `GET /api/products/:id` - Get a specific product by ID
- `POST /api/products/checkout` - Process checkout

### Admin

- `POST /api/products/admin` - Create a new product
- `PUT /api/products/admin/:id` - Update an existing product
- `DELETE /api/products/admin/:id` - Delete a product

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Material UI](https://mui.com/)
- [React Router](https://reactrouter.com/)
- [Express](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
