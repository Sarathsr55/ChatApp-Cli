import React, { useEffect, useState } from 'react'
import './Conversation.css'
import { MessageService, UserService } from '../../services'
import images from '../../Constants/images'
import Seperator from '../Seperator'
import Lottie from 'react-lottie';
import animation from '../../Constants/animation'

const Conversation = ({ data, currentUserId, recieveMessage, sendMessage,setRecentChats }) => {

  const [userData, setUserData] = useState(null)
  const token = localStorage.getItem('user')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([])

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation.SKELETON_LOADING,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(()=>{
    const getMessages = async () => {

      if (data?._id) {
        const result = await MessageService.GetMessages(data?._id, token)
        if (result) {
          setMessages(result?.messages)
          setIsLoading(false)
          setRecentChats(result?.messages[(result?.messages).length - 1])
        }
      } else {
        setMessages([])
        setIsLoading(false)
      }
    }
    getMessages()
    
  },[recieveMessage,sendMessage,data])


  useEffect(() => {
    const userId = data?.members?.find((id) => id != currentUserId)
    if (!userId) {
      setUserData(data)
    } else {
      const getUserData = async () => {
        setIsLoading(true)
        const result = await UserService.getUserById(token, userId)
        if (result) {
          setUserData(result?.data?.data)
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      }
      getUserData()
    }
  }, [data])


 

  return (
    <div className='conversation_container'>
      <div className="user-image">
        <img className='user-image' src={userData?.img ? userData?.img : images.AVATAR_LOGO} alt="" />
      </div>
      <Seperator width={15} />
      {
        isLoading ?
          <div style={{ margin: 0, padding: 0 }}>
            <Lottie options={defaultOptions} height={80} width={300} />
          </div>
          :
          <>
            <div className="chat_content">
              <div className="chat_user">
                <p style={{ margin: 0 }}>
                  {
                    userData?.username
                  }
                </p>
              </div>
              <div className="chat_message">
                <p style={{ margin: '2px 0 2px 0', fontSize: 13, color:'gray' }}>{messages[messages.length - 1]?.text}</p>
              </div>
            </div>
            <div className="chat_time">
              <p style={{ margin: 0, fontSize: 12, color: 'gray' }}>{messages[messages.length - 1]?.time}</p>
            </div>
          </>
      }

    </div>
  )
}

export default Conversation