'use client'
import { useFetchProfile } from '@/hooks/api/queries/settings';
import React from 'react'

const Page = () => {
  const data = useFetchProfile();
  return (
    <div>Page</div>
  )
}

export default Page;