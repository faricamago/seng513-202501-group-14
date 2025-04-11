import Feed from '@/components/feed'
import React, { Suspense } from 'react'

const Announcements = () => {
  return (
    <Suspense>
      <Feed filterBy='announcements' className='w-full' />
    </Suspense>  
  )
}

export default Announcements