import {createContext , useState , useEffect , useContext} from 'react'
import {axiosInstance} from '../axiosCalls/axios.js'

const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
    const[user , setUser] = useState(null)
    const[loading , setLoading] = useState(true)

    useEffect(() =>{
        axiosInstance.get('/customers/me').then((response) =>{
            setUser(response.data.user)
        }).catch(() =>{
            setUser(null)
        }).finally(() =>{
            setLoading(false)
        })
    } , [])

    return(
        <AuthContext.Provider value={{user , setUser , loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)