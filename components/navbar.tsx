'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, FileText, User, Code } from 'lucide-react'
import { Transition } from '@headlessui/react'

const NavLink = ({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) => (
  <Link
    href={href}
    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
  >
    {icon}
    {children}
  </Link>
)

const MobileNavLink = ({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) => (
  <Link
    href={href}
    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
  >
    {icon}
    {children}
  </Link>
)

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed w-full bg-gray-900/80 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0 flex items-center gap-2"
          >
            <Link href="/" className="text-white text-xl font-bold">Artuno-CV</Link>
          </motion.div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/cv-builder" icon={<FileText className="w-4 h-4" />}>CV Oluştur</NavLink>
              <NavLink href="#features" icon={<Code className="w-4 h-4" />}>Özellikler</NavLink>
              <NavLink href="#about" icon={<User className="w-4 h-4" />}>Hakkında</NavLink>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menü */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
            <MobileNavLink href="/cv-builder" icon={<FileText className="w-4 h-4" />}>CV Oluştur</MobileNavLink>
            <MobileNavLink href="#features" icon={<Code className="w-4 h-4" />}>Özellikler</MobileNavLink>
            <MobileNavLink href="#about" icon={<User className="w-4 h-4" />}>Hakkında</MobileNavLink>
          </div>
        </div>
      </Transition>
    </nav>
  )
} 