import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import PageHeader from '../components/ui/PageHeader'
export default function Contact() {
  const { theme } = useTheme()
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <PageHeader title="CONTACT US" subtitle="Get in touch with the Devrayog team." icon="📞" page="CONTACT US" image="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800"/>
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-2">📞</p>
        <p>Content coming soon. Admin can add content from the Admin Panel.</p>
      </div>
    </div>
  )
}