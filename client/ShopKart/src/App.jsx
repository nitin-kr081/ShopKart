import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import PublicRoute from './components/PublicRoute.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Products from './pages/Products.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Navbar from './components/Navbar.jsx'
import AddProduct from './pages/AddProduct.jsx'
import MyProducts from './pages/MyProducts.jsx'
import EditProduct from './pages/EditProduct.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import MyOrders from './pages/MyOrders.jsx'
import OrderDetails from './pages/OrderDetails.jsx'

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/signup' element={<PublicRoute restricted><Signup /></PublicRoute>} />
            <Route path='/login' element={<PublicRoute restricted><Login /></PublicRoute>} />
            <Route path='/' element={<PublicRoute><Home /></PublicRoute>} />
            <Route path='/products' element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path='/products/:id' element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
            <Route path='/wishlist' element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path='/add-product' element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route path='/my-products' element={<ProtectedRoute><MyProducts /></ProtectedRoute>} />
            <Route path='/edit-product/:id' element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
            <Route path='/checkout' element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path='/orders' element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
            <Route path='/orders/:id' element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App