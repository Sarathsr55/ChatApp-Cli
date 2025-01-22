import React,{useState,useContext} from 'react'
import { UserContext } from '../../App'
import Seperator from '../Seperator'
import { IonIcon } from '@ionic/react'
import { chatbubblesOutline } from 'ionicons/icons'
import {exitOutline} from 'ionicons/icons'

import './Tab.css'
import images from '../../Constants/images'
import Chat from '../../Pages/Chat/Chat'

const Tab = ({logOut}) => {

    const {state,dispatch} = useContext(UserContext)
    
    const tabno = state.tab? state.tab : 1


    const tabState = (index)=>{
        setActiveTab(index)
        dispatch({type:'TABS',payload:index})
    }
    const [activeTab,setActiveTab]  = useState(1)
    const [ownerProfile,setOwnerProfile] = useState(false)



    return (

        <div className='tab-contents'>
            <div className='side-panel' >
                <Seperator height={'25px'} />
                <div className="avatar" onClick={()=>setOwnerProfile(true)}>
                    <img className='avatar-img avatar' src={state?.img ? state?.img : images.AVATAR_LOGO} alt="" />
                </div>
                <Seperator height={'25px'} />
                <div className={tabno === 1 ?'home-panel row active' : 'home-panel row'} onClick={()=>tabState(1)} >
                    <IonIcon size='large' icon={chatbubblesOutline} />
                </div>
                <div className={tabno === 2 ?'orders-panel row active' : 'orders-panel row'} onClick={()=>tabState(2)} >
                    
                </div>
                <div className={tabno === 3 ?'orderaccepted-panel row active' : 'orderaccepted-panel row'} onClick={()=>tabState(3)}>
                    
                </div>
                <div className={tabno === 4 ?'pending-panel row active' : 'opending-panel row'} onClick={()=>tabState(4)}>
                    
                </div>
                <div style={{position:'absolute',bottom:50}}>
                    <IonIcon onClick={()=>logOut()} size='large' icon={exitOutline} />
                </div>

            </div>
            <div className='tab-component'>
                <div className={tabno === 1 ?'active-tab':'tab'} >
                    <Chat ownerProfile={ownerProfile} setOwnerProfile={setOwnerProfile} />
                </div>
                <div className={tabno === 2 ?'active-tab':'tab'} >
                    {/* <Orders/> */}
                </div>
                <div className={tabno ===3 ? 'active-tab':'tab'}>
                    {/* <OrderAccepted/> */}
                </div>
                <div className={tabno ===4 ? 'active-tab':'tab'}>
                    {/* <Pending/> */}
                </div>
                

            </div>

        </div>

)
}

export default Tab