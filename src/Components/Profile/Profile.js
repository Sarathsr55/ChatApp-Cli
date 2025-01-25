import React, { useContext, useEffect, useRef, useState } from 'react'
import './Profile.css'
import { IonIcon } from '@ionic/react'
import { close } from 'ionicons/icons'
import images from '../../Constants/images'
import { AuthenticationService, UserService } from '../../services'
import Seperator from '../../Components/Seperator'
import PopUp from '../PopUp/PopUp'
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import imageCrop from '../../imageCrop'
import { uploadCloudinary } from '../../services/uploadImage'
import { UserContext } from '../../App'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ASPECT_RATIO = 1
const MIN_DIMENSION = 450

const Profile = ({ chat, currentUserId, setIsProfileOpen, ownerProfile, setOwnerProfile }) => {

  const imgRef = useRef(null)
  const canvasRef = useRef(null)

  const {state,dispatch} = useContext(UserContext)

  const [userData, setUserData] = useState([])
  const [owner, setOwner] = useState([])
  const token = localStorage.getItem('user')
  const [isProfileOption, setIsProfileOption] = useState(false)
  const [popUp, setPopUp] = useState(false)
  const [img, setImg] = useState()
  const [crop, setCrop] = useState()
  const [result,setResult] = useState()
  const [error, setError] = useState('')

  

  const onSelectFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const imageElement = new Image()
      const imageUrl = reader.result?.toString() || ""
      imageElement.src = imageUrl

      imageElement.addEventListener('load', (e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget
        if (naturalHeight < MIN_DIMENSION || naturalWidth < MIN_DIMENSION) {
          setError('please select atleast 450px * 450px image')
          return setImg('')
        }
      })
      setImg(imageUrl)
    })
    reader.readAsDataURL(file)
    setPopUp(true)
    setIsProfileOption(false)
  }

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget

    const crop = makeAspectCrop(
      {
        unit: '%',
        width: MIN_DIMENSION,
      },
      ASPECT_RATIO,
      width,
      height
    )
    const centeredCrop = centerCrop(crop, width, height)
    setCrop(centeredCrop)
  }



  useEffect(() => {
    senderData()
  }, [chat])

  useEffect(() => {
    ownerData()
  }, [ownerProfile,popUp])

  const ownerData = () => {
    const getOwnerData = async () => {
      const ownerData = await UserService.getUserById(token, currentUserId)
      setOwner(ownerData?.data.data)
      const new_pic = await ownerData?.data?.data?.img
      if(new_pic){
        localStorage.setItem('userData',JSON.stringify(ownerData?.data?.data))
        dispatch({type:'PROFILE_IMG',payload:ownerData?.data?.data?.img});
      }
      
    }
    getOwnerData()
  }

  const senderData = () => {
    if (chat?.members) {

      const userId = chat?.members.find((id) => id !== currentUserId)
      const getUserData = async () => {
        const userdata = await UserService.getUserById(token, userId)
        setUserData(userdata?.data?.data)
      }
      getUserData()
    }
  }

  const handleClose = () => {
    setIsProfileOpen(false)
    setOwnerProfile(false)
    setIsProfileOption(false)
  }

  const handleProfile = () => {
    setIsProfileOption(true)
  }

  const handleOuterClick = () => {
    if (isProfileOption) {
      // setIsProfileOption(false)
    }
  }

  const handleCrop = async() => {
    imageCrop(
      imgRef.current,
      canvasRef.current,
      convertToPixelCrop(
        crop,
        imgRef.current.width,
        imgRef.current.height
      )
    )
    const resultImg = canvasRef.current.toDataURL('image/jpeg')
    setResult(resultImg)
    
    const user = {
      id: currentUserId,
      img: resultImg
    }
    if(resultImg){
      const uploadDp = await AuthenticationService.updateDp(token,user)
      console.log(uploadDp);
      
      if(uploadDp?.status === 200){
        setPopUp(false)
        toast('Updated successfully')
        dispatch({type:'PROFILE_IMG',payload:resultImg})
        
      }
    }
  }

  return (
    <div style={{ height: '100vh', overflowY: 'scroll',borderLeft:'1px solid rgba(173, 169, 169, 0.258)' }}>
      <ToastContainer/>
      <div className="profile_close">
        <IonIcon style={{ height: 28, width: 28, color: 'grey' }} icon={close} onClick={() => handleClose()} />
      </div>

      {
        ownerProfile ?
          <div className='own_profile_container' onClick={() => handleOuterClick()} >
            <div className="profile_img" onClick={() => handleProfile()}>
              <img className='profile_img' style={{ borderRadius:'50%' }} src={owner?.img ? owner?.img :state?.img ? state?.img :  images.AVATAR_LOGO} alt="" />
              {
                isProfileOption ?
                  <div className='profile_option' >
                    <p style={{ position: 'relative', display: 'flex', flexDirection: 'row' }}>
                      Change Photo
                      <input type="file" accept='image/*' onChange={onSelectFile} style={{ position: 'absolute', left: 0, right: 0, height: '100%', width: '100%', opacity: 0, top: 0 }} />
                    </p>
                    <p>View Photo</p>
                    <p>Delete Photo</p>
                  </div>
                  :
                  <div>

                  </div>
              }
            </div>
            <div className="profile_details">
              <h3 style={{ margin: 1 }}>{owner?.username}</h3>
              <p style={{ margin: 1 }}>{owner?.email}</p>
            </div>
            <Seperator height={15} />
            <div className="profile_about">
              <div className="pro_about_cont">
                <h3>About</h3>
                <p>Hey! What's up. I'm Using Chat App </p>
              </div>
            </div>
            <div className="media">
              <div className="media_content">
                <h3>Media</h3>
                <p>No medias yet</p>
              </div>
            </div>
            <div className={popUp ? 'popup' : 'off'}>
              <PopUp setPopUp={setPopUp} >

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  {
                    img && (
                      <div>
                        <ReactCrop
                          crop={crop}
                          onChange={
                            (pixelCrop, percentCrop) => setCrop(percentCrop)
                          }
                          circularCrop
                          keepSelection
                          aspect={ASPECT_RATIO}
                          minWidth={MIN_DIMENSION}
                        >
                          <img
                            ref={imgRef}
                            src={img}
                            alt='upload'
                            style={{ maxHeight: '450px' }}
                            onLoad={onImageLoad}
                          />
                        </ReactCrop>
                      </div>
                    )
                  }

                  <div style={{ position: 'absolute', bottom: 20, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <button style={{ width: 120, height: 40, borderRadius: '10px', border: 'none', cursor: 'pointer', background: '#0bc097', color: 'white', fontSize: 16 }}
                      onClick={handleCrop}

                    >Upload</button>
                    <Seperator width={25} />
                  </div>

                  {
                    crop && 
                    <canvas
                      ref={canvasRef}
                      style={{
                        display:'none',
                        border: '1px solid black',
                        objectFit:'contain',
                        width: 150,
                        height:150
                      }}
                    >

                    </canvas>
                  }
                </div>

              </PopUp>
            </div>
          </div>
          :
          <div className="profile_container">
            <div className="profile_img">
              <img className="profile_img" src={userData?.img ? userData?.img : images.AVATAR_LOGO} alt="" />
            </div>
            <div className="profile_details">
              <h3 style={{ margin: 1 }}>{userData?.username}</h3>
              <p style={{ margin: 1 }}>{userData?.email}</p>
            </div>
            <Seperator height={15} />
            <div className="profile_about">
              <div className="pro_about_cont">
                <h3>About</h3>
                <p>Hey! What's up. I'm Using Chat App </p>
              </div>
            </div>
            <div className="media">
              <div className="media_content">
                <h3>Media</h3>
                <p>No medias yet</p>
              </div>
            </div>
          </div>}
    </div>
  )
}

export default Profile