// src/app/page.tsx
'use client';
import { useFetchProfile } from '@/hooks/api/queries/settings'
import { redirect } from 'next/navigation'

export default function Home() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('@chprbn')
    if (token) {
      redirect('/dashboard/home')
    }
  }
  redirect('/login')
}