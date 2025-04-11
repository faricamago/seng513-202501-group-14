import Feed from '@/components/feed'
import React, { Suspense } from 'react'

const Home = () => {
  return (
    <Suspense>
      <Feed className='w-full'/>
    </Suspense>
  )
}

export default Home