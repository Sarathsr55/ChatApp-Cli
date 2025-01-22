import axios from "axios";
import api from "../constants/api";



export const deleteCloudinaryImage = async(id,proId)=>{

   let product = {
    publicId : id,
    productId : proId
   }
    try {
        const deleteImages = await axios.delete(`${api?.BASE_URL}/product/deleteimage`,{data :product},{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return(deleteImages); 
    } catch (error) {
        console.error(error);
    }
}