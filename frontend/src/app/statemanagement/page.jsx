'use client';
import React, { useState } from 'react'

const StateManagement = () => {
  //let count = 0; 
  const [count, setCount] = useState(0); 
  return (
    <div className='container mx-auto'>
        <h1 className='text-centre font-bold text-3xl my-6'> Event Handling</h1>
        <button className='border p-2'
        onClick={() => {alert('button was clicked');}}
           > Submit
        </button>
        <input type="text" className='border p-2'
        onChange={(e)=> { 
            console.log(e.target.value);
        }}/>

        <input type="text" className='border p-2' placeholder='Key-Event' 
        onKeyDown={(e) => {
            console.log(e.code);
        }}/>
        <h3 className='text-centre text-3xl my-6'>State StateManagement</h3>
        <button className='border p-2'
         onClick={() =>{ setCount(count+1); console.log(count); }}
         >
           
            Increment count
        </button>
        <p className='text-3xl font-bold'>
        {count}
        </p>
    </div>
  )
}

export default StateManagement;