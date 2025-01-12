'use client'

import { useState} from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Download, ArrowLeft, ArrowRight, PlusCircle, Trash2, FileText, User, Code, Menu, X } from 'lucide-react'
import { Document, Page, Text, View, StyleSheet, pdf, Font, Image } from '@react-pdf/renderer'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Transition } from '@headlessui/react'
import { Fragment } from 'react'

// Roboto fontunu kaydet
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
})

// PDF stilleri
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 40,
    fontFamily: 'Roboto'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: '2px solid #2563eb',
    paddingBottom: 20
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginRight: 20
  },
  contactInfo: {
    flexGrow: 1,
    fontSize: 10,
    color: '#4b5563'
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5
  },
  title: {
    fontSize: 16,
    color: '#3b82f6',
    marginBottom: 15,
    fontWeight: 'medium'
  },
  sectionTitle: {
    fontSize: 16,
    color: '#1e3a8a',
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 5
  },
  sectionContent: {
    marginBottom: 20,
    fontSize: 11,
    lineHeight: 1.6
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#4b5563',
    marginBottom: 2
  },
  itemDate: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 5
  },
  itemDescription: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 10,
    lineHeight: 1.5
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  skillDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3b82f6',
    marginRight: 8
  },
  skillText: {
    fontSize: 10,
    color: '#374151'
  },
  links: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10
  },
  link: {
    fontSize: 10,
    color: '#3b82f6',
    textDecoration: 'none'
  }
})

// Form şeması
const formSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1, 'Ad Soyad gerekli'),
    title: z.string().optional(),
    email: z.string().email('Geçerli bir email adresi girin'),
    phone: z.string().min(1, 'Telefon numarası gerekli'),
    location: z.string().min(1, 'Konum gerekli'),
    profileImage: z.string().optional().nullable(),
    website: z.string().optional().nullable(),
    linkedin: z.string().optional().nullable(),
    github: z.string().optional().nullable(),
    summary: z.string().optional().nullable()
  }),
  education: z.array(z.object({
    school: z.string().min(1, 'Okul adı gerekli'),
    degree: z.string().min(1, 'Derece gerekli'),
    fieldOfStudy: z.string().min(1, 'Bölüm gerekli'),
    startDate: z.string().min(1, 'Başlangıç tarihi gerekli'),
    endDate: z.string().min(1, 'Bitiş tarihi gerekli'),
    gpa: z.string().optional(),
    activities: z.string().optional()
  })),
  experience: z.array(z.object({
    company: z.string().min(1, 'Şirket adı gerekli'),
    position: z.string().min(1, 'Pozisyon gerekli'),
    location: z.string().optional(),
    startDate: z.string().min(1, 'Başlangıç tarihi gerekli'),
    endDate: z.string().min(1, 'Bitiş tarihi gerekli'),
    description: z.string().min(1, 'Açıklama gerekli'),
    achievements: z.string().optional()
  })),
  skills: z.array(z.object({
    name: z.string().min(1, 'Yetenek adı gerekli'),
    level: z.enum(['Başlangıç', 'Orta', 'İleri'])
  })),
  languages: z.array(z.object({
    name: z.string().min(1, 'Dil adı gerekli'),
    level: z.enum(['Başlangıç', 'Orta', 'İleri'])
  })),
  certifications: z.array(z.object({
    name: z.string().min(1, 'Sertifika adı gerekli'),
    issuer: z.string().min(1, 'Veren kurum gerekli'),
    date: z.string().min(1, 'Tarih gerekli'),
    link: z.string().optional()
  })),
  projects: z.array(z.object({
    name: z.string().min(1, 'Proje adı gerekli'),
    description: z.string().min(1, 'Açıklama gerekli'),
    technologies: z.string().min(1, 'Teknolojiler gerekli'),
    link: z.string().optional()
  }))
})

type FormData = z.infer<typeof formSchema>

// Sabit kar tanesi pozisyonları
const SNOWFLAKE_POSITIONS = [
  10, 20, 30, 40, 50, 60, 70, 80, 90,
  15, 25, 35, 45, 55, 65, 75, 85, 95,
  5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 100
];

// Kar tanesi komponenti
const Snowflake = ({ position, index }: { position: number, index: number }) => {
  return (
    <motion.div
      className="absolute w-2 h-2 bg-white rounded-full opacity-70"
      initial={{ x: `${position}vw`, y: -20 }}
      animate={{
        y: '100vh',
        opacity: [0.7, 0.3, 0.7],
        rotate: 360,
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay: index * 0.2,
        ease: 'linear',
      }}
    />
  )
}

// Navbar bileşenleri
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

const Navbar = () => {
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
            <img src="/artuno.png" alt="Artuno Logo" className="h-8 w-auto" />
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

// Ortak input stili
const inputClassName = "w-full px-4 py-3 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200"

// Ortak buton stili
const buttonClassName = "flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-all duration-200"

const CVBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  
  const { register, control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        title: '',
        website: '',
        linkedin: '',
        github: '',
        summary: '',
        profileImage: ''
      },
      education: [],
      experience: [],
      skills: [],
      languages: [],
      certifications: [],
      projects: []
    }
  })

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation
  } = useFieldArray({
    control,
    name: 'education'
  })

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience
  } = useFieldArray({
    control,
    name: 'experience'
  })

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill
  } = useFieldArray({
    control,
    name: 'skills'
  })

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage
  } = useFieldArray({
    control,
    name: 'languages'
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsGeneratingPDF(true);
      
      const MyDocument = () => (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <View style={styles.profileSection}>
                {profileImage && (
                  <Image src={profileImage} style={styles.profileImage} />
                )}
                <View>
                  <Text style={styles.name}>{data.personalInfo.fullName}</Text>
                  <Text style={styles.title}>{data.personalInfo.title}</Text>
                  <View style={styles.contactInfo}>
                    <Text>{data.personalInfo.email}</Text>
                    <Text>{data.personalInfo.phone}</Text>
                    <Text>{data.personalInfo.location}</Text>
                  </View>
                  <View style={styles.links}>
                    {data.personalInfo.website && (
                      <Text style={styles.link}>{data.personalInfo.website}</Text>
                    )}
                    {data.personalInfo.linkedin && (
                      <Text style={styles.link}>{data.personalInfo.linkedin}</Text>
                    )}
                    {data.personalInfo.github && (
                      <Text style={styles.link}>{data.personalInfo.github}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {data.personalInfo.summary && (
              <>
                <Text style={styles.sectionTitle}>Özet</Text>
                <Text style={styles.sectionContent}>{data.personalInfo.summary}</Text>
              </>
            )}

            {data.education.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Eğitim</Text>
                {data.education.map((edu, index) => (
                  <View key={index} style={styles.sectionContent}>
                    <Text style={styles.itemTitle}>{edu.school}</Text>
                    <Text style={styles.itemSubtitle}>{edu.degree} - {edu.fieldOfStudy}</Text>
                    <Text style={styles.itemDate}>{edu.startDate} - {edu.endDate}</Text>
                    {edu.gpa && <Text style={styles.itemDescription}>Not Ortalaması: {edu.gpa}</Text>}
                    {edu.activities && <Text style={styles.itemDescription}>{edu.activities}</Text>}
                  </View>
                ))}
              </>
            )}

            {data.experience.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Deneyim</Text>
                {data.experience.map((exp, index) => (
                  <View key={index} style={styles.sectionContent}>
                    <Text style={styles.itemTitle}>{exp.company}</Text>
                    <Text style={styles.itemSubtitle}>{exp.position}</Text>
                    <Text style={styles.itemDate}>{exp.startDate} - {exp.endDate}</Text>
                    <Text style={styles.itemDescription}>{exp.description}</Text>
                    {exp.achievements && (
                      <Text style={styles.itemDescription}>{exp.achievements}</Text>
                    )}
                  </View>
                ))}
              </>
            )}

            {data.skills.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Yetenekler</Text>
                <View style={styles.sectionContent}>
                  {data.skills.map((skill, index) => (
                    <View key={index} style={styles.skillItem}>
                      <View style={styles.skillDot} />
                      <Text style={styles.skillText}>{skill.name} - {skill.level}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {data.languages.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Yabancı Diller</Text>
                <View style={styles.sectionContent}>
                  {data.languages.map((lang, index) => (
                    <View key={index} style={styles.skillItem}>
                      <View style={styles.skillDot} />
                      <Text style={styles.skillText}>{lang.name} - {lang.level}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </Page>
        </Document>
      );

      // PDF'i oluştur ve indir
      const pdfBlob = await pdf(<MyDocument />).toBlob();
      const fileName = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;
      
      // Blob'u URL'e çevir
      const url = window.URL.createObjectURL(pdfBlob);
      
      // Link oluştur ve tıkla
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Temizlik
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setIsGeneratingPDF(false);
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      setIsGeneratingPDF(false);
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800/50 [&::-webkit-scrollbar-thumb]:bg-blue-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-blue-500">
      {SNOWFLAKE_POSITIONS.map((position, index) => (
        <Snowflake key={index} position={position} index={index} />
      ))}
      <Navbar />
      
      {/* Arkaplan efektleri */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-24 relative z-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800/50 [&::-webkit-scrollbar-thumb]:bg-blue-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-blue-500">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Progress Bar */}
          <div className="mb-8 bg-white/5 p-6 rounded-lg backdrop-blur-sm">
            <div className="flex justify-between text-sm font-medium text-gray-400">
              {[
                'Kişisel Bilgiler',
                'Eğitim',
                'Deneyim',
                'Yetenekler',
                'Projeler'
              ].map((step, index) => (
                <motion.span
                  key={step}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${currentStep >= index + 1 ? 'text-blue-400 font-bold' : ''} 
                    relative px-4 py-2 rounded-lg transition-colors
                    ${currentStep === index + 1 ? 'bg-blue-500/10' : ''}`}
                >
                  {step}
                </motion.span>
              ))}
            </div>
            <div className="mt-4 h-2 bg-gray-700/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 5) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl border border-white/10 hover:border-blue-500/30 transition-colors"
          >
            <form onSubmit={onSubmit} className="space-y-6">
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold mb-6">Kişisel Bilgiler</h2>
                  
                  {/* Profile Image Upload */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center mb-6"
                  >
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 mb-4">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span>Fotoğraf</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-image"
                    />
                    <label
                      htmlFor="profile-image"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                    >
                      Fotoğraf Yükle
                    </label>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      {...register('personalInfo.fullName')}
                      placeholder="Ad Soyad"
                      className={inputClassName}
                    />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      {...register('personalInfo.title')}
                      placeholder="Ünvan"
                      className={inputClassName}
                    />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      {...register('personalInfo.email')}
                      placeholder="E-posta"
                      className={inputClassName}
                    />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      {...register('personalInfo.phone')}
                      placeholder="Telefon"
                      className={inputClassName}
                    />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      {...register('personalInfo.location')}
                      placeholder="Konum"
                      className={inputClassName}
                    />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      {...register('personalInfo.website')}
                      placeholder="Website"
                      className={inputClassName}
                    />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      {...register('personalInfo.linkedin')}
                      placeholder="LinkedIn"
                      className={inputClassName}
                    />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      {...register('personalInfo.github')}
                      placeholder="GitHub"
                      className={inputClassName}
                    />
                  </div>
                  <textarea
                    {...register('personalInfo.summary')}
                    placeholder="Kendinizi kısaca tanıtın..."
                    className={`${inputClassName} h-32 resize-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800/50 [&::-webkit-scrollbar-thumb]:bg-blue-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-blue-500`}
                  />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold mb-6">Eğitim Bilgileri</h2>
                  
                  {educationFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-6 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Eğitim #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          {...register(`education.${index}.school`)}
                          placeholder="Okul Adı"
                          className={inputClassName}
                        />
                        <input
                          {...register(`education.${index}.degree`)}
                          placeholder="Derece"
                          className={inputClassName}
                        />
                        <input
                          {...register(`education.${index}.fieldOfStudy`)}
                          placeholder="Bölüm"
                          className={inputClassName}
                        />
                        <input
                          {...register(`education.${index}.gpa`)}
                          placeholder="Not Ortalaması"
                          className={inputClassName}
                        />
                        <input
                          {...register(`education.${index}.startDate`)}
                          placeholder="Başlangıç Tarihi"
                          className={inputClassName}
                        />
                        <input
                          {...register(`education.${index}.endDate`)}
                          placeholder="Bitiş Tarihi"
                          className={inputClassName}
                        />
                      </div>
                      <textarea
                        {...register(`education.${index}.activities`)}
                        placeholder="Aktiviteler ve başarılar..."
                        className={`${inputClassName} h-32 resize-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800/50 [&::-webkit-scrollbar-thumb]:bg-blue-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-blue-500`}
                      />
                    </motion.div>
                  ))}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => appendEducation({
                      school: '',
                      degree: '',
                      fieldOfStudy: '',
                      startDate: '',
                      endDate: '',
                      gpa: '',
                      activities: ''
                    })}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  >
                    <PlusCircle size={20} />
                    <span>Eğitim Ekle</span>
                  </motion.button>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold mb-6">İş Deneyimi</h2>
                  
                  {experienceFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-6 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Deneyim #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          {...register(`experience.${index}.company`)}
                          placeholder="Şirket Adı"
                          className={inputClassName}
                        />
                        <input
                          {...register(`experience.${index}.position`)}
                          placeholder="Pozisyon"
                          className={inputClassName}
                        />
                        <input
                          {...register(`experience.${index}.location`)}
                          placeholder="Konum"
                          className={inputClassName}
                        />
                        <input
                          {...register(`experience.${index}.startDate`)}
                          placeholder="Başlangıç Tarihi"
                          className={inputClassName}
                        />
                        <input
                          {...register(`experience.${index}.endDate`)}
                          placeholder="Bitiş Tarihi"
                          className={inputClassName}
                        />
                      </div>
                      <textarea
                        {...register(`experience.${index}.description`)}
                        placeholder="İş tanımı ve sorumluluklar..."
                        className={`${inputClassName} h-32 resize-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800/50 [&::-webkit-scrollbar-thumb]:bg-blue-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-blue-500`}
                      />
                      <textarea
                        {...register(`experience.${index}.achievements`)}
                        placeholder="Başarılar ve projeler..."
                        className={`${inputClassName} h-32 resize-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800/50 [&::-webkit-scrollbar-thumb]:bg-blue-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-blue-500`}
                      />
                    </motion.div>
                  ))}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => appendExperience({
                      company: '',
                      position: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      description: '',
                      achievements: ''
                    })}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  >
                    <PlusCircle size={20} />
                    <span>Deneyim Ekle</span>
                  </motion.button>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Yetenekler */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold mb-6">Yetenekler</h2>
                    
                    {skillFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-lg p-6 space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Yetenek #{index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            {...register(`skills.${index}.name`)}
                            placeholder="Yetenek Adı"
                            className={inputClassName}
                          />
                          <select
                            {...register(`skills.${index}.level`)}
                            className={`${inputClassName} cursor-pointer`}
                          >
                            <option value="">Seviye Seçin</option>
                            <option value="Başlangıç">Başlangıç</option>
                            <option value="Orta">Orta</option>
                            <option value="İleri">İleri</option>
                          </select>
                        </div>
                      </motion.div>
                    ))}
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => appendSkill({ name: '', level: 'Başlangıç' })}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                    >
                      <PlusCircle size={20} />
                      <span>Yetenek Ekle</span>
                    </motion.button>
                  </motion.div>

                  {/* Diller */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold mb-6">Yabancı Diller</h2>
                    
                    {languageFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-lg p-6 space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Dil #{index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeLanguage(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            {...register(`languages.${index}.name`)}
                            placeholder="Dil Adı"
                            className={inputClassName}
                          />
                          <select
                            {...register(`languages.${index}.level`)}
                            className={`${inputClassName} cursor-pointer`}
                          >
                            <option value="">Seviye Seçin</option>
                            <option value="Başlangıç">Başlangıç</option>
                            <option value="Orta">Orta</option>
                            <option value="İleri">İleri</option>
                          </select>
                        </div>
                      </motion.div>
                    ))}
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => appendLanguage({ name: '', level: 'Başlangıç' })}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                    >
                      <PlusCircle size={20} />
                      <span>Dil Ekle</span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isGeneratingPDF}
                  className={`${buttonClassName} w-full justify-center ${isGeneratingPDF ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isGeneratingPDF ? (
                    <span>Oluşturuluyor...</span>
                  ) : (
                    <>
                      <Download size={20} />
                      <span>PDF İndir</span>
                    </>
                  )}
                </motion.button>
              )}

              {/* Navigation Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center pt-6"
              >
                <div className="w-[100px]">
                  {currentStep > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={prevStep}
                      className="flex items-center gap-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                    >
                      <ArrowLeft size={20} />
                      <span>Geri</span>
                    </motion.button>
                  )}
                </div>
                
                <div className="flex-1 flex justify-end">
                  {currentStep < 5 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg min-w-[120px] justify-center"
                    >
                      <span>İleri</span>
                      <ArrowRight size={20} />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default CVBuilder 