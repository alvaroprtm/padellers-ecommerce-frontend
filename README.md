# Padellers E-Commerce Frontend

A React-based frontend for a multi-supplier e-commerce platform with role-based interfaces for suppliers and customers.

## Tech Stack

- **React 19.1.1** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **React Context** for state management

## Features

### For Customers
- Browse and search products
- Shopping cart with persistent storage
- Order placement and history
- Responsive mobile-friendly design

### For Suppliers
- Product management (CRUD operations)
- Order tracking for their products
- Inventory overview
- Customer order details

### Authentication
- Role-based login (customer/supplier)
- Protected routes and navigation
- Persistent sessions with Laravel Sanctum

## Quick Start

### Prerequisites
- Node.js 18+
- Backend API running on `http://localhost:8000`

### Setup
```bash
# Install dependencies
npm install

# Create .env file (optional - defaults to localhost:8000)
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env

# Start development server
npm run dev
```

Application runs at `http://localhost:5173`

## Development

### Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Key API Endpoints
- **Auth**: `/api/register`, `/api/login`, `/api/logout`
- **Products**: `/api/products` (CRUD operations)
- **Orders**: `/api/orders` (view and create)

## Architecture

### State Management
- **AppContext**: Authentication and global state
- **CartContext**: Shopping cart operations

### Custom Hooks
- **useAuth**: Authentication logic
- **useProducts**: Product management
- **useSupplierProducts**: Supplier-specific operations
- **useUserOrders**: Order history management

## Deployment

For production deployment:

```bash
npm run build
```

Set environment variable:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

Compatible with Vercel, Netlify, and other static hosting platforms.