import axios from "axios"
import ApiConstants from "../Constants/ApiConstants"



const createPost = async (post, token) => {
    try {
        if (post?.phone) {
            let requestBody = {
                mobile: post?.mobile,
                model: post?.model,
                problem: post?.problem,
                location: post?.location,
                district:post?.district,
                phone: post?.phone,
                postedBy: post?.postedBy,
                name:post?.name,
                status:post?.status,
                amount:post?.amount
            }
            let postResponse = await axios.post('http://ec2-54-159-166-105.compute-1.amazonaws.com:3000/api/post/createpost', requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (postResponse.status) {
                return {
                    status: true,
                    message: 'post created '
                }
            } else {
                return {
                    status: false,
                    message: 'failed'
                }
            }
        } else {
            return {
                status: false,
                message: 'please enter a phone number'
            }
        }
    } catch (error) {
        console.log(`error occured : ${error}`);
    }
}
const myPost = async (user, token) => {
    let id = user
    try {
        const postResponse = await axios.get(`http://ec2-54-159-166-105.compute-1.amazonaws.com:3000/api/post/mypost/${id}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        if(postResponse){
            
            return {
                status:true,
                message: 'posts fetched successfully',
                data: postResponse?.data
            }
        }else{
            console.log('error while fetching data');
        }
    } catch (error) {
        console.log(`error while fetching : ${error}`);
    }
    
}

const deletePost = async(id,token)=>{
    try {
        const deletePost = await axios.delete(`http://ec2-54-159-166-105.compute-1.amazonaws.com:3000/api/post/deletepost/${id}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        if(deletePost){
            return {
                status: true,
                message: 'post deleted successfully'
            }
        }else{
            console.log('error occured here');
        }
    } catch (error) {
        console.log(`error occured due to : ${error}`);
    }
}

export default { createPost, myPost, deletePost }