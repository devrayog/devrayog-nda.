import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import PageHeader from '../components/ui/PageHeader'
export default function InstallApp() {
  const { theme } = useTheme()
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <PageHeader title="INSTALL APP" subtitle="Add Devrayog NDA AI to your phone home screen." icon="📲" page="INSTALL APP" image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800"/>
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-2">📲</p>
        <p>Content coming soon. Admin can add content from the Admin Panel.</p>
      </div>
    </div>
  )
}