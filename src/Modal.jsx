import { FaSpinner } from 'react-icons/fa'
import { TbLocation } from 'react-icons/tb'
export const OriginModal = ({ locations, setOrigin, setShowModal, isLoading }) => {
    const handleSelected = (location) => {
        let locationId = location.id
        if (location.id.length > 15) locationId = location.parent.id
        setOrigin(prev => ({ ...prev, input: location.name, selected: locationId }))
        setShowModal(prev => ({ ...prev, origin: false }))
    }
    return (
        <div className="border pt-10 bg-white z-10 absolute border-gray-200 top-9 rounded-lg p-6 left-0 w-full h-[300px] cursor-pointer overflow-y-scroll">
            {isLoading &&
                <FaSpinner className='absolute top-1 right-1' />
            }
            {locations.map(location => (
                <div className="flex flex-col" key={location.id} onClick={() => handleSelected(location)}>
                    <div className='flex items-center border-b border-gray-300'>
                        <TbLocation  className='mr-2'/>
                        <p className="pt-3 mb-3">{location.name}</p>
                    </div>
                    <p className="text-gray-500">{location.parent.name}</p>
                </div>
            ))}
        </div>
    )
}

export const DestinationModal = ({ locations, setDestination, setShowModal, isLoading }) => {
    const handleSelected = (location) => {
        let locationId = location.id
        if (location.id.length > 15) locationId = location.parent.id
        setDestination(prev => ({ ...prev, input: location.name, selected: locationId }))
        setShowModal(prev => ({ ...prev, destination: false }))
    }
    return (
        <div className="border bg-white absolute border-gray-200 top-8 rounded-lg p-6 left-0 w-full h-[500px] cursor-pointer overflow-y-scroll">
            {isLoading &&
                <FaSpinner className='absolute top-1 right-1' />
            }
            {locations.map(location => (
                <div className="flex flex-col" key={location.id} onClick={() => handleSelected(location)}>
                    <div className='flex items-center border-b border-gray-300'>
                        <TbLocation  className='mr-2'/>
                        <p className="pt-3 mb-3">{location.name}</p>
                    </div>
                    <p className="text-gray-500">{location.parent.name}</p>
                </div>
            ))}
        </div>
    )
}