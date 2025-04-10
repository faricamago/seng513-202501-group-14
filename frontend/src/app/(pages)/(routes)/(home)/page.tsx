import React, { Suspense } from 'react'
import { Metadata } from 'next';
import Home from './home'

export const metadata: Metadata = {
  title: 'Dinoverse',
  description: 'UCalgary Social Platform',
};

const Page = () => {
  return (
    <Suspense fallback={<div className='flex justify-center items-center h-screen'>Loading...</div>}>
      <Home/>
    </Suspense>
  )
};

export default Page;