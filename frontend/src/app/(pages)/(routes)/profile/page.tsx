import React, { Suspense } from 'react'
import { Metadata } from 'next';
import Profile from './profile'

export const metadata: Metadata = {
  title: 'Profile - Dinoverse',
  description: 'View your profile and edit your settings',
};

const Page = () => {
  return (
    <Suspense fallback={<div className='flex justify-center items-center h-screen'>Loading...</div>}>
      <Profile/>
    </Suspense>
  )
};

export default Page;