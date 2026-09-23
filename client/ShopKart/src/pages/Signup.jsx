import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios.js'
import { useAuth } from '../context/AuthContext.jsx'

function Signup() {
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' })
    const [loader, setLoader] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { setUser } = useAuth()

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        try {
            const response = await axiosInstance.post('/customers/register', form)
            console.log("User Registered")
            setUser(response.data.user)
            navigate('/home')
        } catch (error) {
            const message = error.response.data.message
            setError(message)
        } finally {
            setLoader(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-teal-50/40 to-slate-100 p-4">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white p-8 shadow-lg shadow-teal-900/5 border border-slate-200/80">

                {/* Brand Header */}
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 font-bold text-xl border border-teal-100 shadow-sm">
                        SK
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">ShopKart</h1>
                    <p className="mt-1 text-sm text-slate-500">Create your account to start shopping</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="space-y-4">

                    {/* Full Name */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="John Doe"
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-200 bg-teal-50/20 px-3.5 py-2.5 text-sm text-slate-800 transition-colors placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-200 bg-teal-50/20 px-3.5 py-2.5 text-sm text-slate-800 transition-colors placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="+1 (555) 000-0000"
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-200 bg-teal-50/20 px-3.5 py-2.5 text-sm text-slate-800 transition-colors placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-200 bg-teal-50/20 px-3.5 py-2.5 text-sm text-slate-800 transition-colors placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loader}
                        onClick={handleSubmit}
                        className="mt-2 w-full rounded-lg bg-teal-600 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-all hover:bg-teal-700 active:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                    >
                        {loader ? (
                            <>
                                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                Registering...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                {/* Subtle Divider */}
                <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Signup