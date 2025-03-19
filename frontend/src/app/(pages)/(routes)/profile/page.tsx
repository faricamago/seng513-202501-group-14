import React from 'react'
import { Metadata } from 'next';
import Profile from './profile'

export const metadata: Metadata = {
  title: 'Profile - Dinoverse',
  description: 'View your profile and edit your settings',
};

const Page = () => {
  return (
    <Profile/>
  )
};

export default Page;