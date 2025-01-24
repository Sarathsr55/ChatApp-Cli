import axios from "axios"

const api = axios.create({
    baseURL: 'https://chatapplication-htk5.onrender.com/api'
})

export const googleAuth = (code)=> api.post('/google',code)