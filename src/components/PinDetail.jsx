import React, { useState, useEffect } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4} from 'uuid'       //uuidv4 is imported from the uuid so that the unique id can be generated

import { client, urlFor } from '../client'    //client and urlFor is imported from the client file so that the data can be fetched from the sanity studio and the url can be generated
import MasonaryLayout from './MasonaryLayout'    //Masonary layout is imported from the MasonaryLayout component so that the pins can be displayed in the masonary layout
import { pinDetailQuery, pinDetailMorePinQuery } from '../utils/data'     //pinDetailQuery and pinDetailMorePinQuery are imported from the data file so that the query can be created to fetch the data from the sanity studio
import Spinner from './Spinner'

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null)
  const [pinDetail, setPinDetail] = useState(null)
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)
  const { pinId } = useParams()

  const addComment = () => {     //function that is called when the comment is added
    if(comment) {                //if the comment is present then the comment is added
      setAddingComment(true);    //setAddingComment is set to true so that the comment can be added

      client                   //client is used to fetch the data from the sanity studio
        .patch(pinId)          //patch is used to update the data in the sanity studio
        .setIfMissing({ comments: []})     //setIfMissing is used to set the comments if the comments are missing
        .insert('after', 'comments[-1]', [{      //insert is used to insert the comment in the comments array
          comment,              
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          }
        }])      
        .commit()          //commit is used to commit the changes that are made in the sanity studio
        .then(() => {      //promise that is returned when the comment is added in the sanity studio
          fetchPinDetails()    //fetchPinDetails is called so that the pin details can be fetched
          setComment('')        //comment is set to empty so that the comment can be added
          setAddingComment(false)    //setAddingComment is set to false so that the comment can be added
        })
    }
  }
  const fetchPinDetails = () => {       //
    let query = pinDetailQuery(pinId)

    if(query) {
      client.fetch(query)
      .then((data) => { 
      setPinDetail(data[0])

      if(data[0]) {
        query = pinDetailMorePinQuery(data[0])

        client.fetch(query)
        .then((res) => setPins(res))
        }

      })  
    }
  }

  useEffect(() => {
    fetchPinDetails()
  }, [pinId])

  if(!pinDetail) return <Spinner message='Loading Pin...' />
  
  return (
    <>
    <div className='flex  xl-flex-row flex-col m-auto bg-white' style={{ maxWidth: '500px', borderRadius:'32px'}}>
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img 
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            className='rounded-t-3xl rounded-b-lg'
            alt='user-post'
          />
        </div>
        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div className="flex items-center justify-between">
            <div className='flex gap-2 items-center'>
              <a 
                href={`${pinDetail.image.asset.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation() }
                className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
              >
              <MdDownloadForOffline />
              </a>
            </div>
            <a href={pinDetail.destination} target='blank' rel='noreferrer'>
            {pinDetail.destination}
            </a>
          </div>
          <div>
            <h1 className='text-2xl font-bold break-words mt-3'>
            {pinDetail.title}
            </h1>
            <p className='mt-3'>{pinDetail.about}</p>
          </div>
          <Link to={`user-profile/${pinDetail.postedBy?._id}`} className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
            <img
                className='w-8 h-8 rounded-full object-cover'
                src={pinDetail.postedBy?.image}
                alt='user-profile'
            />
            <p className='font-semibold capitalize'>{pinDetail.postedBy?.userName}</p>
        </Link>
        <h2 className='mt-5 text-1xl'>Comments</h2>
        <div className='max-h-370 overflow-y-auto'>
          {pinDetail?.comments?.map((comment,i) => (
            <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
              <img 
                src={comment.postedBy.image}
                alt='user-profile'
                className='w-10 h-10 rounded-full cursor-pointer'      
                />
                <div className='flex flex-col'>
                  <p className='font-bold'>{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
            </div>
          ))}
        </div>
        <div className='flex flex-wrao mt-6 gap-3'>
        <Link to={`user-profile/${pinDetail.postedBy?._id}`}>
        <img
            className='w-8 h-8 rounded-full cursor-pointer'
            src={pinDetail.postedBy?.image}
            alt='user-profile'
        />
    </Link>
    <input 
      className='flex-1 border-gray-100 outline-neutral-400 p-1 rounded-2xl focus:border-gray-300'
      type='text'
      placeholder="Add a comment"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
    />
    <button
      type='button'
      className="bg-gray-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
      onClick={addComment}
    >
    {addingComment ? 'Posting the comment...' :'Post'}
    </button>
        </div>
        </div>
    </div>
    {pins != null && pins.length > 0 ? (
      <>
        <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
          More like this
        </h2>
        <MasonaryLayout pins={pins} />
      </>
    ) : (
      <Spinner message='Loading for pins...' />
    )}
    </>
  )
}  

export default PinDetail