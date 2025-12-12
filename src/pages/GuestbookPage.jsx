import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useData } from '../contexts/DataContext'
import { Heart, MessageCircle, Send } from 'lucide-react'

const GuestbookPage = () => {
  const { data, addItem, updateItem } = useData()
  const [newEntry, setNewEntry] = useState({ name: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newEntry.name && newEntry.message) {
      addItem('guestbook', {
        ...newEntry,
        date: new Date().toISOString().split('T')[0],
        likes: 0
      })
      setNewEntry({ name: '', message: '' })
    }
  }

  const handleLike = (id) => {
    const entry = data.guestbook.find(e => e.id === id)
    updateItem('guestbook', id, { likes: entry.likes + 1 })
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-baloo text-6xl font-bold text-lavender neon-text mb-4">
            ✍️ Guestbook
          </h1>
          <p className="font-pacifico text-2xl text-mint">Leave your mark on our journey</p>
        </motion.div>

        {/* New Entry Form with glass effect */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-8 mb-12 blur-shadow"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Name ✨"
              value={newEntry.name}
              onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
              className="w-full px-6 py-4 rounded-full glass border-2 border-lavender/30 focus:border-lavender bg-transparent text-lavender font-nunito text-lg outline-none transition-all duration-300"
            />
            <textarea
              placeholder="Your Message 💜"
              value={newEntry.message}
              onChange={(e) => setNewEntry({ ...newEntry, message: e.target.value })}
              rows="4"
              className="w-full px-6 py-4 rounded-3xl glass border-2 border-lavender/30 focus:border-lavender bg-transparent text-lavender font-nunito text-lg outline-none resize-none transition-all duration-300"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(201, 167, 245, 0.8)' }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-lavender to-pink text-midnight font-fredoka font-bold text-xl py-4 rounded-full flex items-center justify-center gap-3 shadow-lg shadow-lavender/50"
            >
              <Send size={24} />
              Send Message
            </motion.button>
          </div>
        </motion.form>

        {/* Entries with floating stickers and blur effects */}
        <div className="space-y-6">
          {data.guestbook.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-3xl p-6 relative overflow-hidden group blur-shadow"
            >
              {/* Aurora glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-lavender/10 via-pink/10 to-mint/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-pacifico text-2xl text-lavender">{entry.name}</h3>
                    <p className="font-nunito text-sm text-mint">{entry.date}</p>
                  </div>
                  <motion.button
                    onClick={() => handleLike(entry.id)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 text-pink"
                  >
                    <Heart size={24} fill="currentColor" />
                    <span className="font-nunito font-bold">{entry.likes}</span>
                  </motion.button>
                </div>
                <p className="font-nunito text-lg text-mint leading-relaxed">
                  {entry.message}
                </p>
              </div>

              {/* Floating sticker */}
              <motion.div
                animate={{ y: [-5, 5, -5], rotate: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-4 right-4 text-3xl opacity-50"
              >
                {['💜', '⭐', '✨', '🌙'][index % 4]}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GuestbookPage
