
import axios from 'axios'
import React,{ useContext } from 'react'
// import { getToken, UserContext } from '../../App'
import StorageService from './StorageService'
import ApiConstants from '../Constants/ApiConstants'


const AuthRequest = axios.create({
    baseURL : ApiConstants.BACKEND_API.BASE_API_URL
})


const getUserById = async(token,id)=>{
    try {
        let userResponse = await AuthRequest.get(ApiConstants.BACKEND_API.USER+ApiConstants.BACKEND_API.GET_USER_BY_ID+`/${id}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        if(userResponse?.status){
            return{
                status: true,
                message: 'User Data fetched',
                data: userResponse?.data
            }
        }
        else{
            console.log('failed');
            return{
                status: false,
                message: 'User Data not found'
            }
        }
    } catch (error) {
        console.log(`error : ${error?.message}`);
        return{
            status: false,
            message: 'TokenExpiredError',
            error:'TokenExpiredError'
        }
    }
}


const getUserData = async(token,email)=>{
    
    try {
        let userResponse = await AuthRequest.get(ApiConstants.BACKEND_API.USER+ApiConstants.BACKEND_API.GET_USER+`/${email}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        if(userResponse?.status){
            return{
                status: true,
                message: 'User Data fetched',
                data: userResponse?.data
            }
        }
        else{
            console.log('failed');
            return{
                status: false,
                message: 'User Data not found'
            }
        }
    } catch (error) {
        console.log(`error : ${error?.message}`);
        return{
            status: false,
            message: 'TokenExpiredError',
            error:'TokenExpiredError'
        }
    }
}
const getUser = async(token,phone)=>{
    try {
        let userResponse = await AuthRequest.get(ApiConstants.BACKEND_API.USER+ApiConstants.BACKEND_API.GETUSER+`/${phone}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        if(userResponse?.status){
            return{
                status: true,
                message: 'User Data fetched',
                data: userResponse?.data
            }
        }
        else{
            return{
                status: false,
                message: 'User Data not found'
            }
        }
    } catch (error) {
        return{
            status: false,
            message: 'TokenExpiredError',
            error:'TokenExpiredError'
        }
    }
}


export default {getUserData,getUser,getUserById}