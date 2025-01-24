import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../../App'
import Seperator from '../Seperator'
import { IonIcon } from '@ionic/react'
import { chatbubblesOutline, ellipsisVertical,searchCircle } from 'ionicons/icons'
import { exitOutline } from 'ionicons/icons'

import './Tab.css'
import images from '../../Constants/images'
import Chat from '../../Pages/Chat/Chat'

const Tab = ({ logOut }) => {

    const { state, dispatch } = useContext(UserContext)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [isMobileView, setIsMobileView] = useState(false)
    const [isOption, setIsOption] = useState(false)
    const [isSearchField,setIsSearchField] = useState(false)
    const [isChatHeader,setIsChatHeader] = useState(true)
    const tabno = state.tab ? state.tab : 1


    const tabState = (index) => {
        setActiveTab(index)
        dispatch({ type: 'TABS', payload: index })
    }
    const [activeTab, setActiveTab] = useState(1)
    const [ownerProfile, setOwnerProfile] = useState(false)

    const screenWidth = () => {
        setWindowWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener("resize", screenWidth)
    })

    useEffect(() => {
        if (windowWidth < 700) {
            setIsMobileView(true)
        } else {
            setIsMobileView(false)
        }
    }, [windowWidth])

    return (

        <div className={isMobileView ? 'table_contents_top' : 'tab-contents'} onClick={() => {
            if (isOption) {
                setIsOption(false)
            }
        }}>
            {
                isMobileView ?
                    <>
                        <div className={isChatHeader?'top-panel':'chat_messages_off'} >

                            <Seperator height={'25px'} />
                            <div className="chatlist_header" >
                                <h2 style={{ color: '#0bc097', margin: 0 }}>Chat App</h2>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <IonIcon onClick={()=>setIsSearchField(true)}  className='search_icon' style={{ height: 28, width: 28 }} icon={searchCircle} />
                                    <IonIcon onClick={() => setIsOption(!isOption)} className='search_icon' style={{ height: 22, width: 22 }} icon={ellipsisVertical} />
                                </div>
                            </div>
                            <div className={tabno === 1 ? 'home-panel row active' : 'home-panel row'} onClick={() => tabState(1)} >
                            </div>
                            <div className={tabno === 2 ? 'orders-panel row active' : 'orders-panel row'} onClick={() => tabState(2)} >

                            </div>
                            <div className={tabno === 3 ? 'orderaccepted-panel row active' : 'orderaccepted-panel row'} onClick={() => tabState(3)}>

                            </div>
                            <div className={tabno === 4 ? 'pending-panel row active' : 'opending-panel row'} onClick={() => tabState(4)}>

                            </div>

                            <Seperator height={'25px'} />


                        </div>
                        {
                            isOption ?
                                <div style={{ minWidth: 160, position: 'absolute', top: 50, right: 50, background: 'white', borderRadius: 10, padding: 10, zIndex: 100, cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div onClick={() => setOwnerProfile(true)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',padding:'5px 12px 5px 0' }}>
                                            <div className="avatar_mob" >
                                                <img className='avatar-img avatar_mob' src={state?.img ? state?.img : images.AVATAR_LOGO} alt="" />
                                            </div>
                                            <Seperator width={5} />
                                            Profile    
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',padding:'5px 0 5px 0' }}>
                                            <IonIcon onClick={() => logOut()} size='large' icon={exitOutline} />
                                            Lougout
                                        </div>
                                    </div>
                                </div>
                                :
                                ''
                        }
                    </>
                    :
                    <div className='side-panel' >
                        <Seperator height={'25px'} />
                        <div className="avatar" onClick={() => setOwnerProfile(true)}>
                            <img className='avatar-img avatar' src={state?.img ? state?.img : images.AVATAR_LOGO} alt="" />
                        </div>
                        <Seperator height={'25px'} />
                        <div className={tabno === 1 ? 'home-panel row active' : 'home-panel row'} onClick={() => tabState(1)} >
                            <IonIcon size='large' icon={chatbubblesOutline} />
                        </div>
                        <div className={tabno === 2 ? 'orders-panel row active' : 'orders-panel row'} onClick={() => tabState(2)} >

                        </div>
                        <div className={tabno === 3 ? 'orderaccepted-panel row active' : 'orderaccepted-panel row'} onClick={() => tabState(3)}>

                        </div>
                        <div className={tabno === 4 ? 'pending-panel row active' : 'opending-panel row'} onClick={() => tabState(4)}>

                        </div>
                        <div style={{ position: 'absolute', bottom: 50 }} >
                            <IonIcon onClick={() => logOut()} size='large' icon={exitOutline} />
                        </div>

                    </div>
            }
            <div className='tab-component' onClick={() => setIsOption(false)}>
                <div className={tabno === 1 ? 'active-tab' : 'tab'} >
                    <Chat setIsChatHeader={setIsChatHeader} isSearchField={isSearchField} setIsSearchField={setIsSearchField} windowWidth={windowWidth} ownerProfile={ownerProfile} setOwnerProfile={setOwnerProfile} />
                </div>
                <div className={tabno === 2 ? 'active-tab' : 'tab'} >
                    {/* <Orders/> */}
                </div>
                <div className={tabno === 3 ? 'active-tab' : 'tab'}>
                    {/* <OrderAccepted/> */}
                </div>
                <div className={tabno === 4 ? 'active-tab' : 'tab'}>
                    {/* <Pending/> */}
                </div>


            </div>

        </div>

    )
}

export default Tab