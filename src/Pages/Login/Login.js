import React,{useContext, useState} from 'react'
import './Login.css'
import Seperator from '../../Components/Seperator'
import { IonIcon } from '@ionic/react'
import { arrowForward, code } from 'ionicons/icons'
import images from '../../Constants/images'
import AuthenticationService from '../../services/AuthenticationService'
import {useNavigate} from 'react-router-dom'
import {useGoogleLogin,GoogleLogin} from '@react-oauth/google'
import { googleAuth } from '../../services/GoogleAuth'
import axios from 'axios'
import { UserContext } from '../../App'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

  const navigate = useNavigate()

  const [email,setEmail] = useState('')
  const {state,dispatch} = useContext(UserContext)

  

  return (
    <div className='login_container'>
      <ToastContainer/>
        <div className="login_form">
            <Seperator height={20} />
            <h3>Login</h3>
            <img style={{height:190}} src={images.SECURITY_VECTOR} alt="" />
            <Seperator height={10} />
            {/* <div className="email">
                <input onChange={(e)=>setEmail(e.target.value)} type="text" placeholder='Email' style={{width:280,height:35,border:'none',borderBottom:'1px solid gray'}} />
            </div> */}
            <Seperator height={50} />
            {/* <button onClick={()=>googleLogin()} style={{width:65,height:65,background:'rgba(239, 39, 39, 0.95',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'50%',cursor:'pointer'}} >
              <IonIcon style={{color:'white',fontSize:25}} icon={arrowForward}  />
            </button> */}
            <GoogleLogin 
              onSuccess={async(credentialResponse)=>{
                const result = await googleAuth(credentialResponse)
                toast('successfully logged in')
                localStorage.setItem('user',result.data.token)
                dispatch({type:'USER_DATA',payload: result.data.savedUser})
                localStorage.setItem('userData', JSON.stringify(result.data.savedUser))
                navigate('/')
              }}
              onError={()=>{
                toast('login failed');
              }}
            />
        </div>
    </div>
  )
}

export default Login