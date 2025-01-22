import React,{useEffect,createContext, useReducer, useContext, useState} from 'react';
import './App.css';
import Login from './Pages/Login/Login';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Home from './Pages/Home/Home';
import User from './Pages/User/User';
import Otp from './Pages/Otp/Otp';
import { GeneralReducer, initialState } from './Components/reducers/GeneralReducers';
import { UserService } from './services';
import { GoogleOAuthProvider } from '@react-oauth/google';
import config from './config';

export const UserContext = createContext()

export const Routing = ({isStateChange,logOut})=>{
  const navigate = useNavigate()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = localStorage.getItem('user')
    const user_data = JSON.parse(localStorage.getItem('userData'))
    if(user){
      dispatch({type:'TOKEN',payload:user})
      if(user_data){
        dispatch({type:'USER_DATA',payload:user_data})
        dispatch({type:'PROFILE_IMG',payload:user_data?.img})
        
      }
    }
    else{

      navigate('/login')
    }
  },[isStateChange])

  
  return(
    <Routes>
      <Route exact path='/' element={<Home logOut={logOut} />} />
      
    </Routes>
  )
}

function App() {
  const GoogleAuthWrapper = ()=>{
    return (
      <GoogleOAuthProvider clientId={config.CLIENT_ID}>
        <Login></Login>
      </GoogleOAuthProvider>
    )
  }

  const [state,dispatch] = useReducer(GeneralReducer,initialState)
  const [isStateChange,setIsStateChange] = useState(false)
  
  const checkToken = async()=>{
    const token = await localStorage.getItem('user')
    if(!token){
      dispatch({type:'TOKEN',payload:null})
    }else{
      dispatch({type:'TOKEN',payload:token})
    }
  }

  const logOut = async()=>{
    // const result = await localStorage.removeItem('user');
    const removeAll = await localStorage.clear()
    dispatch({type:'USER_DATA',payload:{}})
    checkToken()
  }

  useEffect(()=>{
    if(state.token === null){
      setIsStateChange(true)
    }else{
      setIsStateChange(false)
    }
  },[state])

  return (
    <div className="App">
      <UserContext.Provider value={{state,dispatch}}>
      <Router>
        <Routing isStateChange={isStateChange} logOut={logOut} />
        <Routes>
          
          <Route path='/login' element={<GoogleAuthWrapper/>} />
          <Route path='/user' element={<User/>} />
          <Route path='/otp' element={<Otp/>} />
        </Routes>
      </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
