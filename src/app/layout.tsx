import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  // 1. Podstawowy tytuł (widoczny w kartach na komputerze)
  title: 'qJonathan - System rezerwacji zajęć',
  
  // 2. Opis SEO
  description: 'System rezerwacji lekcji z fizyki i matematyki. Wybierz termin i buduj swoją przewagę.',
  
  // 3. Ikonka SVG (Czapka)
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎓</text></svg>',
  },

  // 4. METADANE DLA MOBILEK I SOCIAL MEDIA (OpenGraph)
  // To sprawia, że w podglądzie kart na Androidzie/iOS nazwa będzie poprawna
  openGraph: {
    title: 'qJonathan - System rezerwacji zajęć',
    description: 'System rezerwacji lekcji z fizyki i matematyki.',
    url: 'https://twoja-domena.pl', // Zmień na swoją domenę
    siteName: 'qJonathan',
    locale: 'pl_PL',
    type: 'website',
  },

  // 5. USTAWIENIA DLA iPHONE (Apple Web App)
  // To wymusza nazwę, gdy ktoś doda stronę do ekranu głównego na iOS
  appleWebApp: {
    title: 'qJonathan',
    statusBarStyle: 'default',
    capable: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
