import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import PageHeader from '../components/ui/PageHeader'
export default function Blogs() {
  const { theme } = useTheme()
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <PageHeader title="BLOGS" subtitle="Articles, tips and insights on NDA preparation." icon="✍️" page="BLOGS" image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800"/>
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-2">✍️</p>
        <p>Content coming soon. Admin can add content from the Admin Panel.</p>
      </div>
    </div>
  )
}