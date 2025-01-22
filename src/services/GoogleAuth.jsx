import axios from "axios"

const api = axios.create({
    baseURL: 'https://chatapp-6l69.onrender.com/api'
})

export const googleAuth = (code)=> api.post('/google',code)