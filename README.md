# Padellers E-Commerce Frontend

A React-based frontend application for a multi-supplier e-commerce platform built with TypeScript, Tailwind CSS, and modern React patterns.

## Project Overview

This is the frontend client for an e-commerce platform that provides different interfaces for suppliers and customers. Suppliers can manage their products and view orders, while customers can browse products, add items to cart, and make purchases.

## Tech Stack

- **Framework**: React 19.1.1
- **Language**: TypeScript
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 4.1.12
- **Routing**: React Router Dom 7.8.2
- **HTTP Client**: Axios 1.11.0
- **State Management**: React Context API

## Features Implemented

### Authentication System
- User registration and login for both suppliers and customers
- Role-based access control and navigation
- Persistent authentication state with localStorage
- Protected routes based on user roles

### Customer Features
- Browse products from all suppliers
- View detailed product information with supplier details
- Add products to shopping cart with quantity selection
- Persistent shopping cart using localStorage
- Checkout process to convert cart items to orders
- View order history and track order status

### Supplier Features
- Product management dashboard
- Create, edit, and delete own products
- View orders containing supplier's products
- Access customer information for orders
- Product inventory overview

### User Interface
- Responsive design optimized for mobile and desktop
- Clean and intuitive navigation with role-based menus
- Loading states and error handling throughout the application
- Real-time cart counter in navigation
- Form validation and user feedback


## Key Implementation Details

### State Management
The application uses React Context API for global state management:

- **AppContext**: Manages user authentication, loading states, and error handling
- **CartContext**: Handles shopping cart operations and persistence

### Authentication Flow
1. User registration/login with role assignment (supplier or customer)
2. JWT-like token storage in localStorage via Laravel Sanctum
3. Automatic token inclusion in API requests
4. Role-based navigation and feature access
5. Persistent sessions across browser refreshes

### Shopping Cart Management
- Real-time cart updates with immediate UI feedback
- Persistent cart storage using localStorage
- Quantity management with increment/decrement controls
- Automatic total calculations
- Cart-to-order conversion during checkout

### API Integration
- Centralized Axios configuration with base URL and interceptors
- Automatic authentication token inclusion
- Comprehensive error handling with user-friendly messages
- Loading state management for all API operations

### Responsive Design
- Mobile-first approach using Tailwind CSS utilities
- Adaptive grid layouts for product displays
- Touch-friendly interface elements
- Optimized navigation for small screens

## Installation and Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Backend API running on `http://localhost:8000`

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd padellers-front
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   Create `.env` file if API URL differs from default:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## API Endpoints Integration

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user information

### Products
- `GET /api/products` - List all products (public)
- `GET /api/products/:id` - Get specific product details
- `POST /api/products` - Create new product (suppliers only)
- `PATCH /api/products/:id` - Update product (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)
- `GET /api/supplier/products` - Get supplier's products

### Orders
- `GET /api/orders` - Get user's order history
- `POST /api/orders` - Create new order from cart
- `GET /api/supplier/orders` - Get supplier's orders

## Development Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Create production build
npm run lint     # Run ESLint for code quality
npm run preview  # Preview production build locally
```

## Component Architecture

### Page Components
Each page component handles its own data fetching and state management using custom hooks.

### Custom Hooks
- **useAuth**: Handles authentication logic and API calls
- **useProducts**: Manages product listing and filtering
- **useSupplierProducts**: Handles supplier product CRUD operations
- **useProductDetails**: Fetches individual product information
- **useUserOrders**: Manages customer order history

### Context Providers
- **AppProvider**: Wraps the entire application for authentication state
- **CartProvider**: Provides cart functionality throughout the app

## Styling and Design

### Tailwind CSS Implementation
- Utility-first CSS framework for rapid development
- Custom color scheme and design tokens
- Responsive breakpoints for mobile, tablet, and desktop
- Component-based styling patterns

### Design Patterns
- Card-based layouts for products and orders
- Consistent form styling and validation feedback
- Loading states with skeleton loaders
- Error boundaries and user feedback systems

## Performance Considerations

### Optimization Strategies
- React 19 with latest performance improvements
- Vite for fast development and optimized builds
- Component-level state management to minimize re-renders
- Efficient context usage to prevent unnecessary updates

### Future Optimizations
- Code splitting for route-based lazy loading
- Image optimization and lazy loading
- Memoization of expensive calculations
- Virtual scrolling for large product lists

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- CSS Grid and Flexbox support
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Notes

### Current Implementation Shortcuts
Given the 6-8 hour development timeframe, certain shortcuts were taken:

- Basic image URL input instead of file upload system
- Simple error handling with browser alerts
- Client-side validation only
- Basic responsive design implementation

### Future Enhancements
- Advanced search and filtering capabilities
- Product image upload with drag-and-drop
- Real-time order status updates via WebSocket
- Product review and rating system
- Advanced cart features (save for later, recommendations)
- Payment gateway integration
- Progressive Web App (PWA) features
- Comprehensive test suite with React Testing Library
- Performance monitoring and analytics

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Configure environment variables for production:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Hosting Options
- Vercel for automatic deployments
- Netlify for static hosting with redirect rules
- AWS S3 with CloudFront for scalable hosting
- GitHub Pages for simple static hosting