import React from 'react'
import './PopUp.css'
import images from '../../Constants/images'

const PopUp = ({children,setPopUp}) => {

  const handleClose = ()=>{ 
    setPopUp(false)
  }
  return (
    <div className='popup_on'>
      <div className='popup-container'>
        <div className=''>
          <div className='popup-close-btn' onClick={()=>handleClose()} ><img style={{height:25}} src={images.CLOSE} alt="" /></div>
          <div className="popup-contents">
          {children}
          </div>
        </div>
    </div>
    </div>
  )
}

export default PopUp