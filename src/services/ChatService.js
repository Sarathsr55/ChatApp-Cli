import axios from "axios";
import ApiConstants from "../Constants/ApiConstants";

const AuthRequest = axios.create({
    baseURL : ApiConstants.BACKEND_API.BASE_API_URL
})

const findChats = async(id,token)=>{
    const chats = await AuthRequest.get(ApiConstants.BACKEND_API.CHATS+'/'+id,{
        headers:{
            Authorization : `Bearer ${token}`
        }
    })
    return chats
}

const createChat = async(members,token)=>{
    const result = await AuthRequest.post(ApiConstants.BACKEND_API.BASE_API_URL+ApiConstants.BACKEND_API.CHATS,members,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
    return result
}

const deleteChat = async(_id)=>{
    const id ={
        _id : _id
    }
    
    const result = await AuthRequest.delete(ApiConstants.BACKEND_API.BASE_API_URL+ApiConstants.BACKEND_API.CHATS+ApiConstants.BACKEND_API.DELETECHAT,{data:id})
    
    return result
}

 export default {findChats,createChat,deleteChat}