import React from 'react'
import { Metadata } from 'next'
import Announcements from './announcements';

export const metadata: Metadata = {
  title: 'Announcements - Dinoverse',
  description: 'UCalgary Social Platform Announcements',
};

const Page = () => {
  return <Announcements/>
};

export default Page;