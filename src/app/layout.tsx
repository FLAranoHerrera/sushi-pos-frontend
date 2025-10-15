import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'SushiPOS - Sistema de Punto de Venta',
    template: '%s | SushiPOS'
  },
  description: 'Sistema de punto de venta completo para restaurantes de sushi. Gestión de productos, órdenes, pagos y usuarios con interfaz moderna y responsiva.',
  keywords: ['POS', 'punto de venta', 'sushi', 'restaurante', 'gestión', 'Next.js', 'TypeScript'],
  authors: [{ name: 'FLAranoHerrera' }],
  creator: 'FLAranoHerrera',
  publisher: 'SushiPOS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://sushi-pos-frontend.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    title: 'SushiPOS - Sistema de Punto de Venta',
    description: 'Sistema de punto de venta completo para restaurantes de sushi',
    siteName: 'SushiPOS',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}