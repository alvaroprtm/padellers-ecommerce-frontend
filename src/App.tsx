import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import { AppLayout } from './components/Applayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import ProductDetails from './pages/products/ProductDetails';
import Cart from './pages/cart/Cart';
import Orders from './pages/orders/UserOrders';
import AddProduct from './pages/products/AddProduct';
import EditProduct from './pages/products/EditProduct';
import SupplierOrders from './pages/orders/SupplierOrders';
import { CanAccess } from './components/CanAccess';

function App() {

  return (
    <AppProvider>
      <CartProvider>
        <AppLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            
            <Route path="/" element={<Home/>} />
            <Route path="/product/:id" element={<ProductDetails/>} />

            <Route path="/product/create" element={
              <CanAccess permission="product.create" fallback={<div>Access Denied</div>}>
                <AddProduct/>
              </CanAccess>
            }/>
            <Route path="/product/:id/edit" element={
              <CanAccess permission="product.edit" fallback={<div>Access Denied</div>}>
                <EditProduct/>
              </CanAccess>
            } />

            <Route path="/cart" element={<Cart/>} />
            <Route path="/orders" element={
              <CanAccess permission="order.view" fallback={<div>Access Denied</div>}>
                <Orders/>
              </CanAccess>
            } />

            <Route path="/supplier/orders" element={
              <CanAccess permission="product.order.view" fallback={<div>Access Denied</div>}>
                <SupplierOrders/>
              </CanAccess>
            } />
          </Routes>
        </AppLayout>
      </CartProvider>
    </AppProvider>
    
  )
}

export default App
