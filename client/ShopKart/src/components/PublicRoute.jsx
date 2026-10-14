import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { Navigate } from 'react-router-dom'

function PublicRoute({ children, restricted = false }) {
    const { user, loading } = useAuth()

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (restricted && user) {
        return <Navigate to='/' replace />
    }

    return children
}

export default PublicRoute