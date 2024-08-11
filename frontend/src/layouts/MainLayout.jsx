import React from 'react'
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <>
      <div className='relative bg-black-50 h-screen w-screen overflow-x-hidden'>
        {children}
        <Navbar/>
      </div>
    </>
  )
}

export default MainLayout;