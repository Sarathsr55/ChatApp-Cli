import React,{useState} from 'react'
import './User.css'
import Seperator from '../../Components/Seperator'
import { IonIcon } from '@ionic/react'
import { arrowForward } from 'ionicons/icons'
import images from '../../Constants/images'
import AuthenticationService from '../../services/AuthenticationService'
import {useNavigate,useLocation} from 'react-router-dom'

const User = () => {

    const navigate = useNavigate()
    const {state} = useLocation()
    const {email} = state

    const [userName,setUserName] = useState('')

    const handleProfile = async()=>{
        const user = {
            email,
            userName
          }
    
          const upDateName = await AuthenticationService.userNameUpdate(user)
          if(upDateName.data === 'success'){
            navigate('/otp',{state:{email:email}})
          }else{
            console.log('error occured while updating');
          }
    }

  return (
    <div className='user_container'>
        <div className="user_form">
            <Seperator height={20} />
            <h3>Profile</h3>
            <img style={{height:190}} src={images.PROFILE_VECTOR
            } alt="" />
            <Seperator height={10} />
            <div className="username">
                <input onChange={(e)=>setUserName(e.target.value)} type="text" placeholder='Username' style={{width:280,height:35,border:'none',borderBottom:'1px solid gray'}} />
            </div>
            <Seperator height={50} />
            <div onClick={()=>handleProfile()} style={{width:65,height:65,background:'rgba(239, 39, 39, 0.95',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'50%',cursor:'pointer'}} >
              <IonIcon style={{color:'white',fontSize:25}} icon={arrowForward}  />
            </div>
        </div>
    </div>
  )
}

export default User