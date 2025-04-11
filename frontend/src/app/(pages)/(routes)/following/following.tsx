import Feed from '@/components/feed'
import React, { Suspense } from 'react'

const Following = () => {
  return (
    <Suspense>
      <Feed filterBy='following' className='w-full' />
    </Suspense>
  )
}

export default Following