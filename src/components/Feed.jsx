import React , {useState , useEffect} from 'react'  //useState and useEffect are imported from the react so that the state and the effect hooks can be used in the component
import { useParams } from 'react-router-dom'      //useParams is imported from the react-router-dom so that the parameters can be accessed from the url
 
import { client } from '../client'                //client is imported from the client file so that the data can be fetched from the sanity studio
import MasonaryLayout from './MasonaryLayout'    //Masonary layout is imported from the MasonaryLayout component so that the pins can be displayed in the masonary layout
import Spinner from './Spinner'
import { feedQuery, searchQuery } from '../utils/data'      //feedQuery and searchQuery are imported from the data file so that the query can be created to fetch the data from the sanity studio

const Feed = () => {
  const [loading, setLoading] = useState(false)
  const [pins, setPins] = useState(null)
  const { categoryId } = useParams()

  useEffect(() => {
    setLoading(true)

    if(categoryId) {
      const query = searchQuery(categoryId)   //if category id is present then the search query is created with the category id so that the data can be fetched from the sanity studio

      //sort the category on the basis of alphabet

      

      client.fetch(query)                    //data is fetched from the sanity studio with the query that is created above
      .then((data) => {                      //promise that is returned when the data is fetched from the sanity studio , the main purpose of this promise is to set the pins in the state so that it can be displayed on the website
        setPins(data)                        //data is set in the pins state so that it can be displayed on the website
        setLoading(false)                    //setloading is set to false so that the loading can be stopped
      })
    } else {
      client.fetch(feedQuery)              //if category id is not present then the feed query is created so that the data can be fetched from the sanity studio
      .then((data) => {                    //promise that is returned when the data is fetched from the sanity studio , the main purpose of this promise is to set the pins in the state so that it can be displayed on the website
        setPins(data);                     //data is set in the pins state so that it can be displayed on the website
        setLoading(false);                 //setloading is set to false so that the loading can be stopped
      })
    }

  }, [categoryId])    //hook is called when the component mounts(mounts: when the component is rendered) and when the category id changes
  

  if(loading ) return <Spinner message='Wait while we are fetching your data!' />

  if(!pins?.length) return <h2>No pins available</h2>     //if pins are not present then the message is displayed that no pins are available
  return (
    <div>
        {pins && <MasonaryLayout pins={pins} />}        {/*Masonary layout is displayed with the pins that are fetched from the sanity studio*/}
    </div>
  )
}

export default Feed