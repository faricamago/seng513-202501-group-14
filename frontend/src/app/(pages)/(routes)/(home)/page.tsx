import React from 'react'
import { Metadata } from 'next';
import Home from './home'

export const metadata: Metadata = {
  title: 'Dinoverse',
  description: 'UCalgary Social Platform',
};

const Page = () => {
  return <Home/>
};

export default Page;