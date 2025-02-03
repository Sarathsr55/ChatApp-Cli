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
import Lottie from 'react-lottie'
import animation from '../../Constants/animation'

const Login = () => {

  const navigate = useNavigate()

  const [email,setEmail] = useState('')
  const {state,dispatch} = useContext(UserContext)
  const [isLoading,setIsLoading] = useState(false)

  const loginAnimation = {
    loop: true,
        autoplay: true,
        animationData: animation.LOGIN_ANIMATION,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
  }

  const backAnimation = {
    autoplay: true,
    loop: true,
    animationData: animation.BACK_ANIMATION_1,
    rendererSettings: {
      preserveAspectRatio : 'xMidYMid slice'
    }
  }
  const dotAnimation = {
    autoplay: true,
    loop: true,
    animationData: animation.ANIMATION_2,
    rendererSettings: {
      preserveAspectRatio : 'xMidYMid slice'
    }
  }
  const loadingAnimation= {
    autoplay: true,
    loop: true,
    animationData: animation.LOADING_CIRCLE,
    rendererSettings: {
      preserveAspectRatio : 'xMidYMid slice'
    }
  }

  return (
    <div className='login_container'>
      <ToastContainer/>
          <div style={{position:'absolute',height:'70%',width:'100%'}}>
            <Lottie options={backAnimation}  />
          </div>
        <div className="login_form">
            <Seperator height={20} />
            <h3>Login</h3>
            {/* <img style={{height:190}} src={images.SECURITY_VECTOR} alt="" /> */}
            <Lottie options={loginAnimation} height={150} width={200} />
            <Seperator height={20} />
            <Lottie options={dotAnimation} height={120} width={200} />
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
                setIsLoading(false)
                navigate('/')
              }}
              onError={()=>{
                setIsLoading(false)
                toast('login failed');
              }}
            />
            {
              isLoading?
            <Lottie options={loadingAnimation} height={50} width={50} />
            :
            ''
            }
        </div>
    </div>
  )
}

export default Login