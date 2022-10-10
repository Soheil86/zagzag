import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Detail = ({ originId = 'placeID:8111000:51', destinationId = 'placeID:8118078:-1' }) => {

    const [journeyData, setJourneyData] = useState([])
    const [status, setStatus] = useState('loading')
    const [privateJourney, setPrivateJourney] = useState('')
    const [publicJourney, setPublicJourney] = useState('') 
    
    useEffect(() => {
        async function getData() {
            const url = `https://efastatic.vvs.de/umweltrechner/XML_TRIP_REQUEST2?
            language=de&locationServerActive=1&command=&usage=&anyObjFilter=&searchLimitMinutes=360&ptOptionsActive=1&illumTransfer=on&itOptionsActive=1&delMinDistTrips=1&coordListOutputFormat=STRING&convertStopsPTKernel2LocationServer=1&convertPOIsITKernel2LocationServer=1&outputOptionsActive=1&calcNumberOfTrips=1&itdTime=1600&computeMonomodalTripCar=1&speedFactorCar=100%25&costFactorCar=0%25&distanceFactorCar=10%25&traveltimeFactorCar=90%25&lineRestriction=403&calculateCO2=1&calculateDistance=1&anyType_origin=&type_origin=any&anyObjFilter_origin=0&place_origin=&anyType_destination=&type_destination=any&anyObjFilter_destination=0&place_destination=&outputFormat=rapidJSON&includeFares=true&useUT=true&name_origin=${originId}&name_destination=${destinationId}:-1&itdDate=20220711`
            const response = await axios.get(url)
            console.log(response)
            const { journeys } = response.data
            
            if (journeys !== undefined) {
                setStatus('success')
                journeys.forEach(journey => {
                    let co2journey = 0
                    let isPrivate = false
                    journey.legs.forEach(leg => {
                        const keys = Object.keys(leg.properties)
                        const substr = 'CO2Emission_Actual'
                        const actualKey = keys.find(key => key.includes(substr))
                        co2journey += parseFloat(leg.properties[`${actualKey}`])
                        if(leg.transportation.product.name === 'Auto'){
                            setPrivateJourney({...journey, co2: co2journey.toFixed(0)})
                        } else{
                            setPublicJourney({...journey, co2: co2journey.toFixed(0)})
                        }
                    })
                    setJourneyData(prev => ([...prev, {co2: co2journey, distance: journey.legs[0].distance, isPrivate}]))
                })
            } else {
                setStatus('error')
            }
        }
        getData()
    }, [originId, destinationId])

    return (
        <div className='flex flex-col items-center'>
            <p className='text-3xl font-semibold mb-10'>Journeys</p>

            <div className='flex'>
                {status === 'loading' &&
                    <p>Loading data</p>
                }
                {status === 'success' &&
                    <div className='flex'>
                        <div className='bg-black text-white px-4 h-52 w-[220px] flex flex-col items-center justify-center rounded-md mr-4'>
                            <p>Distance</p>
                            <span className='text-4xl'>{journeyData[0].distance}</span>
                        </div>
                        <div className='bg-black text-white h-52 px-4 w-[220px] flex flex-col items-center justify-center rounded-md mr-4'>
                            <p>Public CO2 Emission</p>
                            <span className='text-4xl'>{publicJourney.co2}</span>
                        </div>
                        <div className='bg-black text-white h-52 px-4 w-[220px] flex flex-col items-center justify-center rounded-md'>
                            <p>Private CO2 Emission</p>
                            {privateJourney.co2 
                                ? <span className='text-4xl'>{privateJourney.co2}</span>
                                : <span className='text-4xl'>No data</span>
                            }
                        </div>

                    </div>
                }
                {status === 'error' &&
                    <p>An error occurred, please try again or pick some other locations</p>
                }
            </div>
        </div>
    )
}

export default Detail