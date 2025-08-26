import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import { AppLayout } from './components/layouts/Applayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import SupplierOrders from './pages/SupplierOrders';
// import SupplierDashboard from './pages/SupplierDashboard';

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
            <Route path="/product/create" element={<AddProduct/>}/>
            <Route path="/product/:id/edit" element={<EditProduct/>} />

            <Route path="/cart" element={<Cart/>} />
            <Route path="/orders" element={<Orders/>} />

            <Route path="/supplier/orders" element={<SupplierOrders/>} />

            {/* <Route path="/supplier/dashboard" element={<SupplierDashboard/>} /> */}

          </Routes>
        </AppLayout>
      </CartProvider>
    </AppProvider>
    
  )
}

export default App
