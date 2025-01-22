const BACKEND_BASE_URL = 'https://chatapp-6l69.onrender.com'


const BACKEND_API = {
    BASE_API_URL : `${BACKEND_BASE_URL}/api`,
    REGISTER:'/register',
    LOGIN:'/login',
    OTP:'/otp',
    USER_NAME_UPDATE:'/userUpdate',
    USER_DP_UPDATE:'/userDpUpdate',
    USER:'/user',
    REFRESH_TOKEN:'/refresh-token',
    POST:'/post',
    DELETE_USER:'/delete',
    GET_USER: '/get-user',
    GET_USER_BY_ID:'/getuserbyid',
    CHATS: '/chat',
    MESSAGE: '/message'
}

export default {BACKEND_API}