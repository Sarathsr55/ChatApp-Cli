import axios from "axios";

export const uploadCloudinary = async(file)=>{
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset","ghhtsp44")
    const uploading = await axios.post("https://api.cloudinary.com/v1_1/douqsggz9/image/upload", formData)
    if(uploading){
        return uploading?.data
    }
    
}