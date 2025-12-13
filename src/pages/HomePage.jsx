import React, { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useData } from '../contexts/DataContext'
import { Award, Users, Book } from 'lucide-react'

const HomePage = () => {
  const { data } = useData()
  const [activeTab, setActiveTab] = useState('lead')
  const heroRef = useRef(null)
  const { scrollY } = useScroll()
  
  // Hero shrink and translate effect on scroll
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.7])
  const heroY = useTransform(scrollY, [0, 300], [0, -100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <div className="min-h-screen">
      {/* Hero Section - Shrinks and moves to header on scroll */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ scale: heroScale, y: heroY, opacity: heroOpacity }}
          className="text-center z-10 px-4"
        >
          {/* Logo with glow effect - Now editable image */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: 'spring' }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <img
                src={data.siteSettings?.logoUrl}
                alt="Logo"
                className="w-40 h-40 md:w-56 md:h-56 object-contain rounded-full"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(201, 167, 245, 0.8))'
                }}
              />
              {/* Aurora glow ring around logo - KHÔNG CÓ BLUR */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-lavender via-pink to-mint opacity-30" />
            </div>
          </motion.div>

          {/* Title with aurora shimmer - KHÔNG BỊ BLUR */}
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-baloo text-6xl md:text-8xl font-bold text-lavender mb-4"
            style={{
              textShadow: '0 0 20px rgba(201, 167, 245, 0.8), 0 0 40px rgba(201, 167, 245, 0.6)'
            }}
          >
            {data.siteSettings?.siteName || 'Purple Aurora Memories'}
          </motion.h1>

          {/* Slogan */}
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-pacifico text-2xl md:text-3xl text-mint mb-8"
          >
            {data.siteSettings?.tagline || 'Where Dreams Shine Bright ✨'}
          </motion.p>

          {/* CTA Button - NHỎ VÀ TINH TẾ */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 100 }}
          >
            <motion.button
              whileHover={{ 
                scale: 1.03, 
                boxShadow: '0 0 15px rgba(201, 167, 245, 0.5)'
              }}
              whileTap={{ scale: 0.99 }}
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="relative px-6 py-3 rounded-full font-nunito font-semibold text-base text-lavender transition-all duration-200 overflow-hidden"
              style={{
                background: 'rgba(201, 167, 245, 0.08)',
                border: '1px solid rgba(201, 167, 245, 0.3)',
                backdropFilter: 'blur(6px)'
              }}
            >
              {/* Simple hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-lavender/5 to-pink/5 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-full" />
              
              {/* Button content */}
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                Explore Our Journey 
                <motion.span
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block text-lg"
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="text-lavender/50 text-2xl">↓</div>
        </motion.div>
      </section>

      {/* Members Section */}
      <section id="members" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-fredoka text-5xl font-bold text-lavender mb-4 flex items-center justify-center gap-3"
              style={{
                textShadow: '0 0 15px rgba(201, 167, 245, 0.5), 0 0 30px rgba(201, 167, 245, 0.3)'
              }}
            >
              <Users className="text-pink" size={48} />
              Our Amazing Team
            </h2>
            <p className="font-nunito text-xl text-mint">The stars behind the magic</p>
          </motion.div>

          {/* Tabs for Lead/Members - SỬA LẠI CHO DỄ NHÌN */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12 gap-4"
          >
            <button
              onClick={() => setActiveTab('lead')}
              className={`px-8 py-3 rounded-full font-nunito font-bold text-lg transition-all duration-300 relative overflow-hidden ${
                activeTab === 'lead'
                  ? 'border-2 border-lavender shadow-lg shadow-lavender/50'
                  : 'glass border-2 border-transparent hover:border-lavender/30'
              }`}
            >
              {/* Background glow cho tab active */}
              {activeTab === 'lead' && (
                <div className="absolute inset-0 bg-gradient-to-r from-lavender/20 to-pink/20 blur-sm" />
              )}
              <span className={`relative z-10 ${
                activeTab === 'lead' ? 'text-lavender' : 'text-lavender/80'
              }`}>
                👑 Leaders
              </span>
            </button>
            <button
              onClick={() => setActiveTab('member')}
              className={`px-8 py-3 rounded-full font-nunito font-bold text-lg transition-all duration-300 relative overflow-hidden ${
                activeTab === 'member'
                  ? 'border-2 border-pink shadow-lg shadow-pink/50'
                  : 'glass border-2 border-transparent hover:border-pink/30'
              }`}
            >
              {/* Background glow cho tab active */}
              {activeTab === 'member' && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink/20 to-lavender/20 blur-sm" />
              )}
              <span className={`relative z-10 ${
                activeTab === 'member' ? 'text-pink' : 'text-pink/80'
              }`}>
                ⭐ Members
              </span>
            </button>
          </motion.div>

          {/* Members Grid with animated fade on tab switch */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'lead' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 'lead' ? 50 : -50 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {data.members
              .filter(m => m.role === activeTab)
              .map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="glass rounded-3xl p-6 text-center relative overflow-hidden group blur-shadow"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-lavender/10 to-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Avatar - HIỂN THỊ ẢNH THAY VÌ EMOJI */}
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="relative mb-4 mx-auto w-24 h-24"
                    >
                      {member.avatarUrl ? (
                        <>
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-full h-full object-cover rounded-full border-4 border-lavender/30 shadow-lg"
                          />
                          {/* Role badge */}
                          <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg ${
                            member.role === 'lead' 
                              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 border-2 border-amber-300' 
                              : 'bg-gradient-to-r from-pink-400 to-purple-500 border-2 border-pink-300'
                          }`}>
                            {member.role === 'lead' ? '👑' : '⭐'}
                          </div>
                          {/* Glow ring */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-lavender/30 to-pink/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                      ) : (
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-7xl mb-4"
                        >
                          {member.avatar}
                        </motion.div>
                      )}
                    </motion.div>
                    
                    {/* Name */}
                    <h3 className="font-fredoka text-2xl font-bold text-lavender mb-2">
                      {member.name}
                    </h3>
                    
                    {/* Nickname */}
                    <p className="font-pacifico text-lg text-pink mb-4">
                      "{member.nickname}"
                    </p>
                    
                    {/* Fun Fact */}
                    <p className="font-nunito text-sm text-mint">
                      {member.funFact}
                    </p>
                  </div>

                  {/* Floating sparkles */}
                  <motion.div
                    animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-2 right-2 text-2xl"
                  >
                    ✨
                  </motion.div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass rounded-3xl overflow-hidden blur-shadow"
          >
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Image side with aurora overlay */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative rounded-2xl overflow-hidden group"
              >
                <img
                  src="https://i.postimg.cc/HkZHwyCg/perlindor-chiennhudo-3762845028374006081-s2025-12-12-22-38-184-story.jpg"
                  alt="Our Story"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-lavender/30 to-pink/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>

              {/* Text side */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col justify-center"
              >
                <h2 className="font-fredoka text-4xl font-bold text-lavender mb-6 flex items-center gap-3"
                  style={{
                    textShadow: '0 0 10px rgba(201, 167, 245, 0.5)'
                  }}
                >
                  <Book className="text-mint" size={40} />
                  Our Story
                </h2>
                <p className="font-nunito text-lg text-mint leading-relaxed mb-4">
                  Born from a shared dream and unstoppable passion, Perlindor is more than a team—it's a family bound by creativity, determination, and the magic of friendship.
                </p>
                <p className="font-nunito text-lg text-pink leading-relaxed mb-4">
                  From late-night brainstorming sessions to celebrating our biggest victories, every moment has been a chapter in our incredible journey together.
                </p>
                <p className="font-nunito text-lg text-neonYellow leading-relaxed">
                  We believe in the power of collaboration, the beauty of diversity, and the magic that happens when passionate people come together to create something extraordinary. ✨
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-fredoka text-5xl font-bold text-lavender mb-4 flex items-center justify-center gap-3"
              style={{
                textShadow: '0 0 15px rgba(201, 167, 245, 0.5), 0 0 30px rgba(201, 167, 245, 0.3)'
              }}
            >
              <Award className="text-neonYellow" size={48} />
              Our Achievements
            </h2>
            <p className="font-nunito text-xl text-mint">Celebrating excellence and milestones</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative group"
              >
                {/* CHỈ VIỀN VÀNG BAO QUANH - không có background vàng */}
                <div className="absolute -inset-0.5 border-4 border-neonYellow rounded-3xl opacity-70 group-hover:opacity-100 group-hover:border-8 transition-all duration-300"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(255, 228, 122, 0.8))'
                  }}
                />
                
                <div className="relative glass rounded-3xl p-6 text-center overflow-hidden blur-shadow bg-dark/90 backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`text-7xl mb-4 text-${achievement.color}`}
                  >
                    {achievement.icon}
                  </motion.div>

                  <h3 className="font-fredoka text-2xl font-bold text-lavender mb-2">
                    {achievement.title}
                  </h3>

                  <p className={`font-nunito text-sm font-bold text-${achievement.color} ${achievement.color === 'neonYellow' ? 'animate-pulse' : ''}`}>
                    {achievement.category}
                  </p>

                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-2 right-2 text-2xl"
                  >
                    ⭐
                  </motion.div>
                  
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        y: [-5, 5, -5],
                        x: [-3, 3, -3],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 3 + i,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                      className={`absolute text-xl text-${achievement.color} ${
                        i === 0 ? 'top-1 left-4' :
                        i === 1 ? 'top-1 right-4' :
                        i === 2 ? 'bottom-1 left-4' :
                        'bottom-1 right-4'
                      }`}
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
