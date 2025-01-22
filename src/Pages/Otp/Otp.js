import React,{useContext, useState} from 'react'
import './Otp.css'
import Seperator from '../../Components/Seperator'
import { IonIcon } from '@ionic/react'
import { arrowForward } from 'ionicons/icons'
import images from '../../Constants/images'
import AuthenticationService from '../../services/AuthenticationService'
import {useNavigate,useLocation} from 'react-router-dom'
import OTPInput, { ResendOTP } from "otp-input-react";
import { UserContext } from '../../App'
import UserService from '../../services/UserService'

const Otp = () => {

    const navigate = useNavigate()
    const {state} = useLocation()
    const {email} = state
    
    const {dispatch} = useContext(UserContext)

    const [code, setCode] = useState('')

    const handleOTP = async()=>{
        let password = code

        let user = {
            email,
            password
        }


        const loginVerification = await AuthenticationService.otpVerification(user)
        if(loginVerification?.status){
            localStorage.setItem('user',loginVerification?.data)
            localStorage.setItem('email',loginVerification?.email)
            const userData = await UserService.getUserData(loginVerification?.data, loginVerification?.email)
                if (userData?.data?.status) {
                    dispatch({type:'USER_DATA',payload: userData?.data.data})
                    localStorage.setItem('userData', JSON.stringify(userData?.data.data))
                }
            navigate('/')
        }else{
            console.log('invalid otp');
        }
    }

  return (
    <div className='otp_container'>
        <div className="otp_form">
            <Seperator height={20} />
            <h3>OTP Verification</h3>
            <img style={{height:190}} src={images.PROFILE_VECTOR
            } alt="" />
            <Seperator height={10} />
            <div className='otpbox'>
                <p style={{ padding: '0 30px 0 30px' }} >Enter the OTP Verification code we have sent to {email} </p>
                <Seperator height={15} />
                <div className='otp-group'>
                    <OTPInput inputStyles={{ height: 50, width: 35, marginRight: 10, borderColor: 'green',borderRadius:'10px' }} value={code} onChange={setCode} autoFocus OTPLength={6} otpType="number" disabled={false} />
                </div>
            </div>

            <Seperator height={45} />
            <div onClick={()=>handleOTP()}  style={{width:65,height:65,background:'rgba(239, 39, 39, 0.95',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'50%',cursor:'pointer'}} >
              <IonIcon style={{color:'white',fontSize:25}} icon={arrowForward}  />
            </div>
        </div>
    </div>
  )
}

export default Otp