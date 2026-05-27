import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import PageHeader from '../components/ui/PageHeader'
export default function NotFound() {
  const { theme } = useTheme()
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <PageHeader title="404 — NOT FOUND" subtitle="This page does not exist." icon="🔍" page="404 — NOT FOUND" image="https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=800"/>
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-2">🔍</p>
        <p>Content coming soon. Admin can add content from the Admin Panel.</p>
      </div>
    </div>
  )
}