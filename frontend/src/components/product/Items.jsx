import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const Items = (id,image,name,price) => {

     const { currency } = useContext(ShopContext)


  return (
    <Link className= 'text-gray-700 cursor-pointer' to={`/product/${id}`}>
        <div className='overflow-hidden'>
            <img className='hover:-scale-y-110 transition ease-in-out' src={image[0]} alt=""/>  
        </div>
        <p className='pt-3 pb-1' text-sm>{name}</p>
        <p className='text-sm fron-medium'>{currency}{price}</p>
    </Link>
  )
}

export default Items
