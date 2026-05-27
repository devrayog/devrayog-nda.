import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import PageHeader from '../components/ui/PageHeader'
export default function Vocabulary() {
  const { theme } = useTheme()
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <PageHeader title="VOCABULARY BUILDER" subtitle="AI-curated daily words with meanings." icon="💬" page="VOCABULARY BUILDER" image="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800"/>
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-2">💬</p>
        <p>Content coming soon. Admin can add content from the Admin Panel.</p>
      </div>
    </div>
  )
}