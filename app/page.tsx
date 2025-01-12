'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MouseTrail } from '@/components/mouse-trail'
import { Navbar } from '@/components/navbar'
import { FileText, Code, User, Star, Clock, Download, CheckCircle, Award, Users } from 'lucide-react'

// Kar tanesi komponenti
const Snowflake = () => {
  const randomX = Math.random() * 100
  const randomDelay = Math.random() * 5
  
  return (
    <motion.div
      className="absolute w-2 h-2 bg-white rounded-full opacity-70"
      initial={{ x: `${randomX}vw`, y: -20 }}
      animate={{
        y: '100vh',
        opacity: [0.7, 0.3, 0.7],
        rotate: 360,
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay: randomDelay,
        ease: 'linear',
      }}
    />
  )
}

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all group"
  >
    <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
    <p className="text-gray-300 leading-relaxed">{description}</p>
  </motion.div>
)

const StatCard = ({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-lg text-center"
  >
    <div className="flex justify-center mb-4 text-blue-400">
      {icon}
    </div>
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    <div className="text-gray-400">{label}</div>
  </motion.div>
)

export default function Home() {
  // Kar taneleri dizisi
  const snowflakes = Array.from({ length: 30 }, (_, i) => <Snowflake key={i} />)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
      {snowflakes}
      <MouseTrail />
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8"
            >
              Artuno-CV
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl leading-relaxed text-gray-300 max-w-3xl mx-auto"
            >
              Profesyonel CV&apos;nizi kolayca oluşturun ve kariyerinizde fark yaratın.
              Modern tasarımlar ve kullanıcı dostu arayüz ile hayalinizdeki işe bir adım daha yaklaşın.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link
                href="/cv-builder"
                className="rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-500 hover:scale-105 transition-all duration-300"
              >
                CV Oluşturmaya Başla
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard value="1000+" label="Mutlu Kullanıcı" icon={<Users className="w-8 h-8" />} />
          <StatCard value="50+" label="CV Şablonu" icon={<FileText className="w-8 h-8" />} />
          <StatCard value="24/7" label="Destek" icon={<Clock className="w-8 h-8" />} />
          <StatCard value="4.9/5" label="Kullanıcı Puanı" icon={<Star className="w-8 h-8" />} />
        </div>
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Neden Bizi Seçmelisiniz?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Modern araçlar ve kullanıcı dostu arayüzümüzle CV oluşturma sürecinizi
            kolaylaştırıyor, profesyonel sonuçlar elde etmenizi sağlıyoruz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Kolay Kullanım"
            description="Sürükle-bırak arayüzü ve adım adım rehberlik ile dakikalar içinde profesyonel bir CV oluşturun."
            icon={<User className="w-8 h-8 text-white" />}
          />
          <FeatureCard
            title="Modern Tasarım"
            description="Güncel trendlere uygun, profesyonel ve dikkat çekici şablonlar ile öne çıkın."
            icon={<Award className="w-8 h-8 text-white" />}
          />
          <FeatureCard
            title="Anında PDF"
            description="CV'nizi anında PDF formatında indirin ve paylaşıma hazır hale getirin."
            icon={<Download className="w-8 h-8 text-white" />}
          />
          <FeatureCard
            title="ATS Uyumlu"
            description="İş başvuru sistemleriyle uyumlu CV'ler oluşturarak kabul edilme şansınızı artırın."
            icon={<CheckCircle className="w-8 h-8 text-white" />}
          />
          <FeatureCard
            title="Özelleştirilebilir"
            description="Renk, font ve düzen seçenekleriyle CV'nizi kişiselleştirin."
            icon={<Code className="w-8 h-8 text-white" />}
          />
          <FeatureCard
            title="Ücretsiz"
            description="Tüm temel özelliklerimizi ücretsiz kullanın, ek ücret ödemeyin."
            icon={<Star className="w-8 h-8 text-white" />}
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
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hakkımızda
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            Artuno-CV, iş arayanların profesyonel CV&apos;lerini kolayca oluşturabilmeleri
            için tasarlanmış modern bir platformdur. Amacımız, herkesin kolayca
            profesyonel bir CV hazırlayabilmesini sağlamaktır.
          </p>
          <p className="text-xl text-gray-300 leading-relaxed">
            Modern teknolojiler ve kullanıcı deneyimi odaklı tasarımımızla,
            CV oluşturma sürecinizi keyifli ve verimli hale getiriyoruz.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
