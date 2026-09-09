import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL : 'http://localhost:8180/',
    headers : {
        'Content-Type' : 'application/json'
    },
    withCredentials : true
})