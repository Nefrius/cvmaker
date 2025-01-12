'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Menu, X, FileText, User, Code, ChevronRight } from 'lucide-react'

// Mouse trail efekti için
const MouseTrail = () => {
  const [trails, setTrails] = useState<{ x: number; y: number; id: string }[]>([])
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newTrail = {
        x: e.clientX,
        y: e.clientY,
        id: `${Date.now()}-${Math.random()}`
      }
      setTrails(prev => [...prev, newTrail].slice(-20))
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {trails.map((trail) => (
        <motion.div
          key={trail.id}
          className="fixed w-2 h-2 bg-blue-500 rounded-full pointer-events-none"
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{
            opacity: 0,
            scale: 0,
            x: trail.x - 4,
            y: trail.y - 4,
          }}
          transition={{ duration: 1 }}
        />
      ))}
    </>
  )
}

// Navbar bileşeni
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed w-full bg-gray-900/80 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="text-white text-xl font-bold">CV Maker</Link>
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

// Feature Card bileşeni
const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-blue-500 transition-colors"
  >
    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
)

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white relative">
      <MouseTrail />
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        {/* Hero Section */}
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Profesyonel CV&apos;nizi
              <span className="text-blue-500"> Dakikalar İçinde </span>
              Oluşturun
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Modern tasarım, kolay kullanım ve profesyonel şablonlarla
              hayalinizdeki işe bir adım daha yaklaşın.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href="/cv-builder"
                className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Hemen Başla
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Neden Bizi Seçmelisiniz?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Modern araçlar ve kullanıcı dostu arayüzümüzle CV oluşturma sürecinizi
              kolaylaştırıyoruz.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Kolay Kullanım"
              description="Sürükle-bırak arayüzü ve adım adım rehberlik ile dakikalar içinde profesyonel bir CV oluşturun."
              icon={<User className="w-6 h-6 text-white" />}
            />
            <FeatureCard
              title="Modern Tasarım"
              description="Güncel trendlere uygun, profesyonel ve dikkat çekici şablonlar."
              icon={<Code className="w-6 h-6 text-white" />}
            />
            <FeatureCard
              title="Anında PDF"
              description="CV'nizi anında PDF formatında indirin ve paylaşıma hazır hale getirin."
              icon={<FileText className="w-6 h-6 text-white" />}
            />
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Hakkımızda
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              CV Maker, iş arayanların profesyonel CV&apos;lerini kolayca oluşturabilmeleri
              için tasarlanmış modern bir platformdur.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Daha Fazla Bilgi
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white mb-4"
                  >
                    CV Maker Hakkında
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-gray-300">
                      CV Maker, modern teknolojiler kullanılarak geliştirilmiş,
                      kullanıcı dostu bir CV oluşturma platformudur. Next.js,
                      Tailwind CSS ve Framer Motion gibi güncel teknolojilerle
                      hazırlanmış olup, kullanıcılara en iyi deneyimi sunmayı
                      hedeflemektedir.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="float-right bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      onClick={() => setShowModal(false)}
                    >
                      Anladım
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
