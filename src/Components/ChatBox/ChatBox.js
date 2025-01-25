import React, { useEffect, useRef, useState } from 'react'
import './ChatBox.css'
import { ChatService, MessageService, UserService } from '../../services'
import images from '../../Constants/images'
import Seperator from '../Seperator'
import { IonIcon } from '@ionic/react'
import { call, videocam, ellipsisHorizontal, happyOutline, paperPlaneOutline, arrowBackCircle, arrowUndo  } from 'ionicons/icons'
import EmojiPicker from 'emoji-picker-react';
import Lottie from 'react-lottie'
import animation from '../../Constants/animation'


const ChatBox = ({ chat, currentUserId, setSendMessage, recieveMessage, onlineUsers, online, setIsProfileOpen, ownerProfile, setOwnerProfile, isMobileView, setIsChatSelected, setCurrentChat, setIsChatHeader }) => {

    const [userData, setUserData] = useState([])
    const token = localStorage.getItem('user')
    const [message, setmessage] = useState('')
    const [messages, setMessages] = useState([])
    const [isOnline, setIsOnline] = useState(false)
    const [lastSeen, setLastSeen] = useState('')
    const [displayLastSeen, setDisplayLastSeen] = useState('')
    const [consecMsg, setConsecMsg] = useState(0)
    const [showEmoji, setShowEmoji] = useState(false)
    const [loading, setLoading] = useState(false)

    const scroll = useRef()

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation.LOADING,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    const defaultOptions2 = {
        loop: true,
        autoplay: true,
        animationData: animation.LOADING_CIRCLE,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    const defaultOptions3 = {
        loop: true,
        autoplay: true,
        animationData: animation.SKELETON_LOADING,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    var today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    var todayDate = new Date(today.split('/')[2], today.split('/')[1] - 1, today.split('/')[0]).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('en-GB', { month: '2-digit', day: '2-digit', year: 'numeric' });
    let yesterdatDate = new Date(yesterday.split('/')[2], yesterday.split('/')[1] - 1, yesterday.split('/')[0]).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })



    useEffect(() => {
        if (userData?.lastseen) {
            setLastSeen(userData.lastseen)
            handleLastSeenDate()
        }
    }, [userData])

    useEffect(() => {
        senderData()
    }, [online])




    const handleLastSeenDate = () => {
        today = new Date(today.split('/')[2], today.split('/')[1] - 1, today.split('/')[0])
        var lastSeenDate = userData.lastseen?.date
        lastSeenDate = new Date(lastSeenDate.split('/')[2], lastSeenDate.split('/')[1] - 1, lastSeenDate.split('/')[0])
        var timeDiff = Math.abs(lastSeenDate.getTime() - today.getTime())
        var diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
        if (diffDays < 1) {
            setDisplayLastSeen('today')
        } else if (diffDays === 1) {
            setDisplayLastSeen('yesterday')
        } else if (diffDays >= 2 && diffDays <= 4) {
            const options = {

            }
            let day = lastSeenDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: '2-digit' }).split(',')[0]
            setDisplayLastSeen(day);
        } else {
            let date = new Date(lastSeenDate).toLocaleDateString('en-US', { month: 'long', day: '2-digit' })
            setDisplayLastSeen(date);
        }
    }



    const groups = messages.reduce((groups, msg) => {
        const date = msg.date
        if (!groups[date]) {
            groups[date] = []
        }
        groups[date].push(msg)
        return groups
    }, {})


    useEffect(() => {
        if (recieveMessage != null) {
            if(userData?._id === recieveMessage?.currentUserId){
               setMessages([...messages, { senderId: recieveMessage?.currentUserId, text: recieveMessage?.message, time: recieveMessage?.time, date: recieveMessage?.date }])
            }
        }
    }, [recieveMessage])

    useEffect(() => {

        senderData()
    }, [chat])

    const senderData = () => {
        setLoading(true)
        const userId = chat?.members.find((id) => id !== currentUserId)
        const getUserData = async () => {
            const userdata = await UserService.getUserById(token, userId)
            setUserData(userdata?.data?.data)
        }
        getUserData()
    }

    useEffect(() => {
        const getMessages = async () => {

            if (chat?._id) {
                const result = await MessageService.GetMessages(chat?._id, token)
                if (result) {
                    setMessages(result?.messages)
                    setLoading(false)
                }
            } else {
                // setMessages([])
                setLoading(false)
            }
        }
        getMessages()
    }, [userData])

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])


    console.log(messages);
    

    const addMessage = async () => {
        if (chat?._id === '') {
            let members = {
                senderId: currentUserId,
                receiverId: userData?._id
            }
            const createChats = await ChatService.createChat(members, token)
            let chatId = createChats?.data.chatId
            const messageResponse = await MessageService.AddMessage(chatId, currentUserId, message, token)
            setMessages([...messages, { senderId: currentUserId, text: message, time: new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }), date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }])
            setmessage('')
            setShowEmoji(false)
            //send message to socket server
            const recieverId = chat.members.find((id) => id !== currentUserId)
            setSendMessage({ message, recieverId, currentUserId, time: new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }), date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) })
        } else {

            const messageResponse = await MessageService.AddMessage(chat?._id, currentUserId, message, token)
            console.log(messageResponse);
            
            setMessages([...messages, { senderId: currentUserId, text: message, time: new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }), date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }])
            setmessage('')
            setShowEmoji(false)
            //send message to socket server
            const recieverId = chat.members.find((id) => id !== currentUserId)
            setSendMessage({ message, recieverId, currentUserId, time: new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }), date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) })
        }
    }

    const handleProfile = () => {
        setOwnerProfile(false)
        setIsProfileOpen(true)
        senderData()
    }

    const onEmojiClick = (e) => {
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        setmessage(prevInput => prevInput + emoji)
    }

    return (
        <div className='chat_box_container'>
            <div className="chat_box_header" >
                {
                    isMobileView?
                    <>
                        <div onClick={()=>{
                            setIsChatSelected(false)
                            setCurrentChat(null)
                            setIsChatHeader(true)
                        }}>
                <IonIcon style={{ color: '#242526', cursor: 'pointer', height: 25, width: 25 }} icon={arrowUndo} />
                </div>
                <Seperator width={5} />
                    </>
                :
                ''
                }
                <div className="profile_pic" onClick={() => handleProfile()}>
                    {
                        loading ?
                            <Lottie options={defaultOptions2} height={40} width={40} />
                            :
                            <img style={{ height: 48, width: 48, borderRadius: '50%' }} src={userData?.img ? userData?.img : images.AVATAR_LOGO} alt="" />
                    }
                </div>
                <Seperator width={15} />
                {
                    loading ?
                        <div style={{display:'flex',justifyContent:'flex-start'}}>
                            <Lottie options={defaultOptions3} height={40} width={140} />
                        </div>
                        :
                        <div style={{display:'flex',alignItems:'center'}}>
                            <div className="user_header" onClick={() => handleProfile()}>
                                <h4 style={{ margin: 0 }} >{userData?.username}</h4>
                                <p style={{ margin: 0, fontSize: 12, color: 'grey' }}>{online ? 'online' : `last seen ${displayLastSeen} at ${lastSeen.time} `}</p>
                            </div>
                            <div className="chat_options">
                                <IonIcon style={{ color: 'grey', cursor: 'pointer', height: 20, width: 20 }} icon={call} />
                                <Seperator width={20} />
                                <IonIcon style={{ color: 'grey', cursor: 'pointer', height: 20, width: 20 }} icon={videocam} />
                                <Seperator width={20} />
                                <IonIcon style={{ color: 'grey', cursor: 'pointer', height: 20, width: 20 }} icon={ellipsisHorizontal} />
                            </div>
                        </div>
                }
            </div>
            <div className="chat"  >
                <EmojiPicker open={showEmoji} onEmojiClick={onEmojiClick} lazyLoadEmojis style={{ position: 'absolute', bottom: 0, zIndex: 1, paddingBottom: 80 }} previewConfig={{ showPreview: false }} height={350} width={'100%'} />
                <div className="typing_section">
                    <div className={message ? "chat_input_field shrink" : "chat_input_field"} >
                        <input type="text" className='chat_input' value={message} onChange={(e) => setmessage(e.target.value)} />
                        <IonIcon onClick={() => setShowEmoji(!showEmoji)} style={{ color: 'grey', cursor: 'pointer', height: 20, width: 20 }} icon={happyOutline} />
                    </div>
                    {
                        message ?
                            <>
                                <Seperator width={15} />
                                <div className="send_button" onClick={() => addMessage()}>
                                    <IonIcon style={{ color: 'white', cursor: 'pointer', height: 25, width: 25, paddingRight: 3, paddingTop: 1 }} icon={paperPlaneOutline} />
                                </div>
                            </>
                            :
                            <div />
                    }
                </div>
                <div className='msg_container' >
                    <div className="message_container">
                        {
                            loading && messages.length === 0 ?
                                <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Lottie options={defaultOptions} height={50} width={50} />
                                </div>
                                :
                                groups ?
                                    Object.keys(groups).map((date, index) => {
                                        return (
                                            <div key={index}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }} ><p style={{ fontSize: 12, background: 'white', padding: '2px 12px 2px 12px', width: 'fit-content', borderRadius: 5 }} >{date === todayDate ? 'Today' : date === yesterdatDate ? 'Yesterday' : date}</p></div>
                                                {
                                                    groups[date].map((obj, index) => {


                                                        return (
                                                            <div key={index} ref={scroll} >
                                                                <div className={obj.senderId === currentUserId ? 'message own' : 'message'} >
                                                                    <div className={obj.senderId === currentUserId ? "msg m-right" : "msg"}>
                                                                        {obj.text}
                                                                        <div className="msg_time">
                                                                            <p style={{ margin: 0, fontSize: 10, color: (obj.senderId === currentUserId) ? 'white' : 'grey' }} >{obj.time}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Seperator height={3} />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                    :
                                    <div>
                                        {
                                            messages.map((obj,index)=>{
                                                return(
                                                    <div key={index} ref={scroll} >
                                                                <div className={obj.senderId === currentUserId ? 'message own' : 'message'} >
                                                                    <div className={obj.senderId === currentUserId ? "msg m-right" : "msg"}>
                                                                        {obj.text}
                                                                        <div className="msg_time">
                                                                            <p style={{ margin: 0, fontSize: 10, color: (obj.senderId === currentUserId) ? 'white' : 'grey' }} >{obj.time}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Seperator height={3} />
                                                            </div>
                                                )
                                            })
                                        }
                                    </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatBox