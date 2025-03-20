import React from 'react'
import { Metadata } from 'next';
import Login from './login'

export const metadata: Metadata = {
  title: 'Dinoverse',
  description: 'UCalgary Social Platform',
};

const Page = () => {
  return (
    <Login/>
  )
};

export default Page;