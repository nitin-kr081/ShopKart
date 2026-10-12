
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../axiosCalls/axios.js'

// Fetch the logged-in user's cart
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/cart')
            return response.data.cart
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Unable to load cart'
            )
        }
    }
)

// Add a product to cart
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/cart/${productId}`)
            return response.data.cart
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Unable to add product'
            )
        }
    }
)

// Update product quantity
export const updateCartQuantity = createAsyncThunk(
    'cart/updateCartQuantity',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(
                `/cart/${productId}`,
                { quantity }
            )
            return response.data.cart
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Unable to update quantity'
            )
        }
    }
)

// Remove a product from cart
export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/cart/${productId}`)
            return response.data.cart
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Unable to remove product'
            )
        }
    }
)

const initialState = {
    cartItems: [],
    loading: false,
    actionLoading: false,
    error: null
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = []
            state.loading = false
            state.actionLoading = false
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false
                state.cartItems = action.payload
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Add product
            .addCase(addToCart.pending, (state) => {
                state.actionLoading = true
                state.error = null
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.actionLoading = false
                state.cartItems = action.payload
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.actionLoading = false
                state.error = action.payload
            })

            // Update quantity
            .addCase(updateCartQuantity.pending, (state) => {
                state.actionLoading = true
                state.error = null
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.actionLoading = false
                state.cartItems = action.payload
            })
            .addCase(updateCartQuantity.rejected, (state, action) => {
                state.actionLoading = false
                state.error = action.payload
            })

            // Remove product
            .addCase(removeFromCart.pending, (state) => {
                state.actionLoading = true
                state.error = null
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.actionLoading = false
                state.cartItems = action.payload
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.actionLoading = false
                state.error = action.payload
            })
    }
})

export const { clearCart } = cartSlice.actions

export default cartSlice.reducer
