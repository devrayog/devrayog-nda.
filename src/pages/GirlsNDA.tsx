import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import PageHeader from '../components/ui/PageHeader'
export default function GirlsNDA() {
  const { theme } = useTheme()
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <PageHeader title="GIRLS NDA" subtitle="Dedicated space for girl NDA candidates." icon="💗" page="GIRLS NDA" image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800"/>
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-2">💗</p>
        <p>Content coming soon. Admin can add content from the Admin Panel.</p>
      </div>
    </div>
  )
}