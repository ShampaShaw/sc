/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import GoogleLogin from 'react-google-login'
import { gapi } from 'gapi-script'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'

import { client } from '../client'

const Login = () => {

  const navigate = useNavigate();

  useEffect(() => {     // this is the google api script that is loaded when the component mounts(mounts: when the component is rendered) 
    gapi.load("client:auth2",() => {   //its a function that loads the google api script
        gapi.auth2.init({clientId:process.env.REACT_APP_GOOGLE_API_TOKEN}) //its a function that initializes the google api script
    })
  },[])

  const responseGoogle = (response) => {    //this function is called when the user logs in with google
    localStorage.setItem('user', JSON.stringify(response.profileObj));   //this saves the user data in the local storage

    const { name, googleId, imageUrl } = response.profileObj;            //this destructures the user data

    const doc = {   //this is the document that is created in the sanity studio
      _id: googleId,  //this is the id of the document
      _type: 'user',  //this is the type of the document
      userName: name,  //this is the name of the user
      image: imageUrl, //this is the image of the user
    }

    client.createIfNotExists(doc)   //this is a function that creates the document if it does not exist
    .then(() => {                   //this is a promise that is returned when the document is created
      navigate('/', { replace: true })  //this is a function that navigates to the home page
    })
  }

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video                           //this is the video that is played in the background
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>  
            <div className='p-5'>               
              <img src={logo} width="130px" alt='logo' />
            </div>

            <div className='shadow-2xl'> 
              <GoogleLogin                //this is the google login button
                clientId= {process.env.REACT_APP_GOOGLE_API_TOKEN}   //this happens when the user logs in with google
                render={(renderProps) => (                           //this is the render function that is called when the user logs in with google
                  <button                                            //this is the button that is rendered when the user logs in with google
                    type="button"
                    className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                    onClick={renderProps.onClick}                   //this is the function that is called when the button is clicked so that the user can log in with google
                    disabled={renderProps.disabled}                 //this is the function that is called when the button is disabled so that the user can not log in with google
                  >
                    <FcGoogle className="mr-4" /> Sign in with Google   
                  </button>                                               //this is the google icon that is displayed when the user logs in with google
                )}
                onSuccess={responseGoogle}                              //when user login is successful this function is called and user is navigated to the home page
                onFailure={responseGoogle}                              //when user login is unsuccessful this function is called so that the user can try again
                cookiePolicy="single_host_origin"                       //cookie policy is set to single host origin which means that the cookie is only sent to the host that is sending the cookie
              />
            </div>
        </div>
      </div>
    </div>
  )
}

export default Login
