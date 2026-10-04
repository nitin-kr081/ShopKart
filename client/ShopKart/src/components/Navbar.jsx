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
        `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
            ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-xs'
            : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
        }`

    return (
        <nav className="bg-slate-50/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand / Logo */}
                    <div className="flex-shrink-0">
                        <NavLink to="/home" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.72-.544l2.58-9a.75.75 0 00-.72-.956H6.126l-.422-1.58A1.875 1.875 0 003.886 2.25H2.25zM7.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                            </div>
                            <span className="text-xl font-extrabold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                                Store<span className="text-indigo-600">App</span>
                            </span>
                        </NavLink>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* Home */}
                        <NavLink to="/home" className={navLinkClasses}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            <span>Home</span>
                        </NavLink>

                        {/* Products */}
                        <NavLink to="/products" end className={navLinkClasses}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                            </svg>
                            <span>Products</span>
                        </NavLink>

                        {/* Wishlist */}
                        <NavLink to="/wishlist" className={navLinkClasses}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            <span>Wishlist</span>
                        </NavLink>

                        {/* My Products */}
                        <NavLink to="/my-products" className={navLinkClasses}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-4 h-4" >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25l-9-5.25-9 5.25m18 0v7.5l-9 5.25m9-12.75l-9 5.25m-9-5.25v7.5l9 5.25m0-7.5v7.5m0-7.5l-9-5.25" />
                            </svg>
                            <span>My Products</span>
                        </NavLink>
                    </div>

                    {/* Logout Button */}
                    <div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200/80 hover:border-rose-600 rounded-xl transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
                        >
                            <span>Logout</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar