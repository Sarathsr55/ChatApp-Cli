import React, { useContext, useEffect, useState } from 'react'
import Tab from '../../Components/Tab/Tab'
import { Routing, UserContext } from '../../App'
import { UserService } from '../../services'

const Home = ({logOut}) => {

  const {state,dispatch} = useContext(UserContext)
  
  useEffect(()=>{
    const user = localStorage.getItem('user')
    const user_data = JSON.parse(localStorage.getItem('userData'))
    if(user){
      dispatch({type:'TOKEN',payload:user})
      if(user_data){
        dispatch({type:'USER_DATA',payload:user_data})
        if(user_data?.img){
          dispatch({type:'PROFILE_IMG',payload:user_data?.img})
        }
        
      }
    }
  },[])
 
  return (
    <div>
      <Tab logOut={logOut}  />
    </div>
  )
}

export default Home