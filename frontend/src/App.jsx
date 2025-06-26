import { useEffect, useState } from 'react'
import './App.css'
import Home from './Pages/Home'
import LogIn from './Pages/LogIn'
import SignUp from './Pages/SignUp'
import Watch from "./Pages/Watch"
import Upload from './Pages/Upload'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { logInFeature } from './features/auth/authSlice'

function App() {
  const dispatch = useDispatch();
  useEffect(()=>{
    const getUserInfo= async()=>{
      const result = await axios.get("http://localhost:3000/user/profile",{
        withCredentials:true
      });
      if(result.status!=401){
        dispatch(logInFeature(result.data));
      }
    }
    getUserInfo();
  },[])

  return (
    <BrowserRouter>
      <div className='h-full w-full min-h-[100vh]'>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/watch/:videoId' element={<Watch/>}></Route>
          <Route path='/signUp/' element={<SignUp />}></Route>
          <Route path='/logIn/' element={<LogIn />}></Route>
          <Route path='/upload/' element={<Upload/>} ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}
export default App
