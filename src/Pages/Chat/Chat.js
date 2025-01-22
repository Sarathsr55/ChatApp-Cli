import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import './Chat.css'
import { IonIcon } from '@ionic/react'
import { search } from 'ionicons/icons'
import { ellipsisVertical } from 'ionicons/icons'
import { close } from 'ionicons/icons'
import Seperator from '../../Components/Seperator'
import { UserContext } from '../../App'
import { ChatService, UserService } from '../../services'
import Conversation from '../../Components/Conversation/Conversation'
import ChatBox from '../../Components/ChatBox/ChatBox'
import { io } from 'socket.io-client'
import Profile from '../../Components/Profile/Profile'
import Lottie from 'react-lottie';
import animation from '../../Constants/animation'


const Chat = ({ ownerProfile, setOwnerProfile }) => {

  const { state, dispatch } = useContext(UserContext)
  const userId = state?.userData?._id
  const [chats, setChats] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [sendMessage, setSendMessage] = useState(null)
  const [recieveMessage, setRecieveMessage] = useState(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [searchData, setSearchData] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [searchedChat, setSearchedChat] = useState(false)
  const [recentchats, setRecentChats] = useState([])
  const token = localStorage.getItem('user')
  const socket = useRef()

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation.CIRCLE_LOADING,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const forceUpdate = useCallback(async () => {
    userChats()
  }, [])



  useEffect(() => {
    forceUpdate()
  }, [recieveMessage, sendMessage])


 

  useEffect(() => {
    socket.current = io('https://socketconnection.onrender.com')
    if (userId != null) {
      socket.current.emit('add-new-user', userId)
      socket.current.on('get-users', (users) => {
        setOnlineUsers(users)
      })
    }
  }, [state?.userData?._id])

  // send message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit('send-message', sendMessage)
    }
  }, [sendMessage])

  //recieve message from socket server
  useEffect(() => {
    socket.current.on('recieve-message', (data) => {
      setRecieveMessage(data)
    })

  })



  const userChats = async () => {
    const result = await ChatService.findChats(userId, token)
    if(result?.data?.chat){
      const response = result?.data?.chat
    if(response.length > 0){
      const sortedchat = response.sort((a,b)=>{
        var DatA = new Date(a.time)
        var DatB = new Date(b.time)
        return DatB - DatA
      })
      setChats(sortedchat);
    }
    }
  }


  useEffect(() => {
    if (token) {
      userChats()
    }
  }, [state?.userData, sendMessage])

  const checkOnlineStatus = (chat) => {

    if (chat?.members) {
      const chatMember = chat.members.find((member) => member !== userId)
      const online = onlineUsers.find((user) => user.userId === chatMember)
      return online ? true : false
    }
  }

  useEffect(() => {
    if (ownerProfile) {
      setCurrentChat(null)
      setIsProfileOpen(false)
    }
  }, [ownerProfile])

  const handleSearch = async (e) => {
    setIsLoading(true)
    setSearchInput(e.target.value)
    if (e.target.value === '') {
      setIsLoading(false)
    }
    const isUser = await UserService.getUserData(token, e.target.value + '@gmail.com')
    if (isUser?.data?.status) {
      setIsLoading(false)
      setSearchData(isUser?.data?.data)
    } else {
      setSearchData()
      setTimeout(() => {
        setIsLoading(false)
      }, 5000)
    }
  }

  const handleSearchedOutput = () => {
    setCurrentChat()
    setSearchedChat(true)
    // setCurrentChat({_id:'',members:[searchData?._id,userId]})
    chats.map(obj => {
      let member = [searchData?._id, userId]
      console.log(member, obj?.members);
      if (obj?.members[0] == member[0] && obj?.members[1] == member[1]) {
        setCurrentChat(obj)
      } else {
        setCurrentChat({ _id: '', members: member })
      }
    })
    setSearchInput('')

  }






  return (
    <div className='chat_container'>
      <div className='chat_list'>
        <div className="header">
          <div className="chatlist_header">
            <h2 style={{ color: '#0bc097', margin: 0 }}>Chat App</h2>
            <IonIcon className='search_icon' style={{ height: 22, width: 22 }} icon={ellipsisVertical} />
          </div>
          <div className="searchbar">
            <input type="text" className='search_input' value={searchInput} onChange={handleSearch} />
            <Seperator width={25} />
            {
              searchInput ?
                <IonIcon onClick={() => { setSearchInput('') }} style={{ color: 'grey' }} icon={close} />
                :
                <IonIcon style={{ color: 'grey' }} icon={search} />
            }
          </div>
          <Seperator height={25} />
        </div>
        <div className='chats_scroll_container' style={{ width: '100%' }}>
          {
            isLoading ?
              <div>
                <Lottie options={defaultOptions} height={40} width={40} />
              </div>
              :
              searchData && searchInput ?
                <div onClick={handleSearchedOutput}>
                  <Conversation setRecentChats={setRecentChats} sendMessage={sendMessage} recieveMessage={recieveMessage} data={searchData} currentUserId={userId} token={token} />
                </div>
                :
                searchInput && !searchData ?
                  <div>
                    No UserData found
                  </div>
                  :
                  chats.sort((a,b)=>{
                    var DatA = new Date(a.time)
                    var DatB = new Date(b.time)
                    return DatB - DatA
                  }).map((obj, index) => {
                    return (
                      <div key={index} onClick={() => {
                        setCurrentChat(obj)
                        setOwnerProfile(false)
                      }}>
                        <Conversation setRecentChats={setRecentChats} sendMessage={sendMessage} recieveMessage={recieveMessage} data={obj} currentUserId={userId} token={token} />
                      </div>
                    )
                  })
          }
        </div>
      </div>
      <div className="chat_messages">
        {

          currentChat ?
            <ChatBox chat={currentChat} currentUserId={userId} setSendMessage={setSendMessage} recieveMessage={recieveMessage} onlineUsers={onlineUsers} online={checkOnlineStatus(currentChat)} ownerProfile={ownerProfile} setOwnerProfile={setOwnerProfile} setIsProfileOpen={setIsProfileOpen} />
            :
            searchedChat && !currentChat ?
              <div>
                <ChatBox chat={{ _id: '', members: [searchData?._id, userId] }} currentUserId={userId} setSendMessage={setSendMessage} recieveMessage={recieveMessage} onlineUsers={onlineUsers} online={checkOnlineStatus(currentChat)} ownerProfile={ownerProfile} setOwnerProfile={setOwnerProfile} setIsProfileOpen={setIsProfileOpen} />
              </div>
              :
              <div>
                Start conversation with friends...
              </div>

        }
      </div>
      <div className={isProfileOpen ? "profiles" : ownerProfile ? "profiles" : "display_off"}>
        <Profile chat={currentChat} currentUserId={userId} setIsProfileOpen={setIsProfileOpen} ownerProfile={ownerProfile} setOwnerProfile={setOwnerProfile} />
      </div>
    </div>
  )
}

export default Chat