import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import PageHeader from '../components/ui/PageHeader'
export default function GATHub() {
  const { theme } = useTheme()
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <PageHeader title="GAT/GK HUB" subtitle="General Ability Test — History, Geography, Science, Polity." icon="🌍" page="GAT/GK HUB" image="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800"/>
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-2">🌍</p>
        <p>Content coming soon. Admin can add content from the Admin Panel.</p>
      </div>
    </div>
  )
}