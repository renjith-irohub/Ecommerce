import React from 'react'
import { Routes, Route, Router } from 'react-router-dom'
import Home from './pages/shop/Home'
import Collection from './pages/shop/Collection'
import Contact from './pages/shop/Contact'
import Product from './pages/shop/Product'
import Navbar from './components/layout/Navbar'
import About from './pages/shop/About'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import SearchBar from './components/common/SearchBar'
import AdminDashboard from './pages/admin/AdminDashboard'
import AuthPage from './pages/auth/Login'
import LatestCollection from './components/product/LatestCollection'
import CartPage from './pages/shop/CartPage'
import Logout from './pages/auth/Logout'
import OrderDetails from './pages/shop/OrderDetails'
import Placeorder from './pages/shop/PlaceOrder'
import ProtectedRoute from './components/common/ProtectedRoute'
import Pagenotfound from './pages/error/Pagenotfound'
import ReportPage from './pages/admin/ReportPage'
import ProductEdit from './components/product/ProductEdit'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'











const App = () => {
  const user = useSelector((state) => state.auth.user)


  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      {user?.role == "user" && <Navbar />}

      <SearchBar />
      <Routes>

        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path="/register" element={<Register />} />
        <Route path='/authpage' element={<AuthPage />} />
        <Route path='/latestCollection' element={<LatestCollection />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/order' element={<OrderDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/placeOrder" element={<Placeorder />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/edit" element={<ProductEdit />} />


        {/* protect All logged in users */}
        <Route path='/' element={
          <ProtectedRoute>

            <Home />

          </ProtectedRoute>}
        />

        {/* admin */}
        <Route path='/admin' element={
          <ProtectedRoute role="admin">

            <AdminDashboard />

          </ProtectedRoute>
        } />

        <Route path='/not-authorized' element={<Pagenotfound />} />

      </Routes>
    </div>
  )
}

export default App

