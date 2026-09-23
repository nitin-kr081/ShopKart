import React from 'react'
import {useAuth} from '../context/AuthContext.jsx'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children}){
    const {user , loading} = useAuth()
    if (loading) {
        return <h1>Loading...</h1>
    }
    if(!user){
        return <Navigate to='/login' />
    }
    return children
}

export default ProtectedRoute