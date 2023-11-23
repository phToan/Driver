import axios from "axios";

const instance = axios.create({
    baseURL: process.env.SERVER_URL
})

instance.interceptors.request.use((config) =>{
    return config
}, (error)=>{
    console.log(error)
    return Promise.reject(error)
})

export default instance