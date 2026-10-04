import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { axiosInstance } from '../axiosCalls/axios.js'

const Navbar = () => {
    const { setUser } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/customers/logout')
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            setUser(null)
            navigate('/login')
        }
    }

    const navLinkClasses = ({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
        }`

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand */}
                    <div className="flex-shrink-0">
                        <NavLink to="/home" className="text-xl font-bold text-indigo-600 tracking-tight">
                            StoreApp
                        </NavLink>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-2">
                        <NavLink to="/home" className={navLinkClasses}>
                            Home
                        </NavLink>

                        <NavLink to="/products" end className={navLinkClasses}>
                            Products
                        </NavLink>

                        <NavLink to="/wishlist" className={navLinkClasses}>
                            Wishlist
                        </NavLink>
                    </div>

                    {/* Logout Button */}
                    <div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar