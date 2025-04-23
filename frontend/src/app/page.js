import Mybutton from '@/components/Mybutton';
import React from 'react'

const Home = () => {
  return (
    <div>
      <h1 className='font-bold text-centre text-3xl'>My Home Page</h1>
      <Mybutton>submit</Mybutton>
      <Mybutton>click me</Mybutton>
      <Mybutton>explore</Mybutton>
      <Mybutton>learn more</Mybutton>
    </div>
  )
}

export default Home;
