import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  TbCurrentLocation,
  TbSwitchVertical,
  TbDotsVertical,
} from 'react-icons/tb'
import { TiLocationOutline } from 'react-icons/ti'
import { DestinationModal, OriginModal } from './Modal'
const Home = ({ setJourney }) => {
  const [origin, setOrigin] = useState({
    input: '',
    locations: [],
    selected: '',
  })
  const [originIsLoading, setOriginIsLoading] = useState(false)
  const [destinationIsLoading, setDestinationIsLoading] = useState(false)
  const [destination, setDestination] = useState({
    input: '',
    locations: [],
    selected: '',
  })
  const [showModal, setShowModal] = useState({
    origin: false,
    destination: false,
  })

  const stationUrl =
    'https://efastatic.vvs.de/umweltrechner/XML_STOPFINDER_REQUEST?outputFormat=rapidJSON&SpEncId=0&coordOutputFormat=EPSG:4326&serverInfo=1&suggestApp=vvs&type_sf=any&version=10.2.10.139&name_sf='

  function sortLocationResponse(locations = []) {
    locations.sort((a, b) => a.matchQuality - b.matchQuality)
    return locations.reverse()
  }
  async function handleOriginChange(e) {
    setOriginIsLoading(true)
    const searchTerm = e.target.value
    if (searchTerm === '') {
      setOrigin((prev) => ({ ...prev, input: '' }))
      setShowModal((prev) => ({ ...prev, origin: false }))
      return
    }
    setShowModal((prev) => ({ ...prev, origin: true }))
    if (searchTerm === '') return
    setOrigin((prev) => ({
      ...prev,
      input: searchTerm,
    }))
    const result = await axios.get(stationUrl + searchTerm)
    const locations = sortLocationResponse(result.data.locations)

    setOrigin((prev) => ({
      ...prev,
      locations,
    }))
    setOriginIsLoading(false)
  }
  function switchLocations() {
    const currentOrigin = origin
    const currentDestination = destination
    setOrigin(currentDestination)
    setDestination(currentOrigin)
  }

  async function handleDestinationChange(e) {
    setDestinationIsLoading(true)
    const searchTerm = e.target.value
    if (searchTerm === '') {
      setDestination((prev) => ({ ...prev, input: '' }))
    }
    setShowModal((prev) => ({ ...prev, destination: true }))
    setDestination((prev) => ({
      ...prev,
      input: searchTerm,
    }))
    const result = await axios.get(stationUrl + searchTerm)
    const locations = sortLocationResponse(result.data.locations)
    setDestination((prev) => ({
      ...prev,
      locations,
    }))
    setDestinationIsLoading(false)
  }

  return (
    <>
      <div className='pt-10 flex mx-56'>
        <div className='border h-fit mx-auto border-gray-200 py-4 px-3 rounded-md  w-[400px]'>
          <p className='text-2xl mb-3'>Choose Route</p>
          <div className='flex items-center '>
            <div className='flex flex-col h-full items-center mr-3 justify-between'>
              <TbCurrentLocation className='text-gray-500' size={25} />
              <TbDotsVertical className='text-gray-500 mt-2 ' size={30} />
              <TiLocationOutline className=' text-gray-600' size={25} />
            </div>
            <div className='flex-1'>
              <div className='relative flex items-center'>
                <input
                  value={origin.input || ''}
                  onChange={handleOriginChange}
                  placeholder='origin'
                  className='p-2 border-b border-gray-300 w-full focus:border-b focus:outline-none'
                />
                {showModal.origin && (
                  <OriginModal
                    locations={origin.locations}
                    setOrigin={setOrigin}
                    setShowModal={setShowModal}
                    isLoading={originIsLoading}
                  />
                )}
              </div>
              <div className='relative flex items-center'>
                <input
                  value={destination.input || ''}
                  onChange={handleDestinationChange}
                  placeholder='destination'
                  className='p-2 border-b mt-4 mb-6 block border-gray-300 w-full focus:border-b focus:outline-none'
                />
                {showModal.destination && (
                  <DestinationModal
                    locations={destination.locations}
                    setShowModal={setShowModal}
                    setDestination={setDestination}
                    isLoading={destinationIsLoading}
                  />
                )}
              </div>
            </div>
            <TbSwitchVertical
              onClick={switchLocations}
              className='cursor-pointer ml-3'
              size={25}
            />
          </div>
          <Link to='/details'>
            <button
              onClick={() =>
                setJourney({
                  origin: origin.selected,
                  destination: destination.selected,
                })
              }
              className='bg-red-800 text-white w-full py-3 rounded-md'
            >
              Next
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home
