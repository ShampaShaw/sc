/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React , { useState, useRef, useEffect } from 'react'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link, Route, Routes } from 'react-router-dom'

import { Sidebar, UserProfile } from '../components'
import { userQuery } from '../utils/data'         
import { client } from '../client'    
import Pins from './Pins'
import logo from '../assets/logo.png'
import { fetchUser } from '../utils/fetchUser'


const Home = () => {

  const [toggleSidebar, setToggleSidebar] = useState(false)     //this is a state that is created with the useState hook , the purpose of this state is to toggle the sidebar
  const [user, setUser] = useState()                            //this is a state that is created with the useState hook , the purpose of this state is to store the user data
  const scrollRef = useRef(null)                                //this is a ref that is created with the useRef hook , the purpose of this ref is to scroll to the top of the page

  const userInfo = fetchUser()                                //function that fetches the user from the user storage

  useEffect(() => {                                           //hook is called when the component mounts(mounts: when the component is rendered) which fetches the user data from the sanity studio
    const query = userQuery(userInfo?.googleId)              //this is the query that is created with the userQuery function that is imported from the data file , the purpose of this query is to fetch the user data from the sanity studio from the user id
 
    client.fetch(query).then((data) => {                    //promise that is returned when the user data is fetched from the sanity studio , promise is  actually a function that is called when the data is fetched from the sanity studio , the main purpose of this function is to set the user data in the state so that it can be displayed on the website
      setUser(data[0]);
    });
  }, [])

  useEffect(() => {

    scrollRef.current.scrollTo(0,0)                      //scroll to the top of the page, here (0,0) is the position where the page is scrolled to

  },[])
  
  return (            //sidebar is displayed when the screen size is medium or large here {user && user} is passed as a prop to the sidebar component so that the user data can be displayed on the sidebar
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>      
        <Sidebar user={user && user} />          
      </div>           
      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
        <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />   
        <Link to="/">
          <img src={logo} alt='logo' className='w-28' />
        </Link>
        <Link >
          <img src={user?.image} alt='user-pic' className='w-9 h-9 rounded-full' />
        </Link>
        </div>
        {toggleSidebar && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute w-full flex justify-end items-center p-2'>
              <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
            </div>
            <Sidebar  closeToggle={setToggleSidebar} user={user && user} />
          </div>
        )}
      </div>
      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile /> } />
          <Route path='/*' element={<Pins user={user && user} /> } />
        </Routes>
      </div>
    </div>
  )
}

export default Home