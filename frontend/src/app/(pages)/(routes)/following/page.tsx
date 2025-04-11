import React from 'react'
import { Metadata } from 'next'
import Following from './following'

const metadata: Metadata = {
  title: 'Following - Dinoverse',
  description: 'View the people you are following',
};

const Page = () => {
  return <Following/>
};

export default Page