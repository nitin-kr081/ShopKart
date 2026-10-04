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

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/signup' element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
            <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path='/products' element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path='/products/:id' element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
            <Route path='/wishlist' element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path='/add-product' element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route path='/my-products' element={<ProtectedRoute><MyProducts /></ProtectedRoute>} />
            <Route path='/edit-product/:id' element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App