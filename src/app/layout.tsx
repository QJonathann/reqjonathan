import type { Metadata } from 'next';
import './globals.css';

// 🎓 TO JEST IKONKA CZAPKI W KODZIE (Base64 SVG)
// Kolor stroke='#A855F7' (fioletowy) możesz zmienić na inny hex
const GRADUATION_CAP_ICON_CODE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNBODU1RjciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1ncmFkdWF0aW9uLWNhcCI+PHBhdGggZD0iTTIyIDEwdjZNMiAxMGwxMC01IDEwIDUtMTAgNXoiLz48cGF0aCBkPSJNNiAxMnY1YzMgMyA5IDMgMTIgMHYtNSIvPjwvc3ZnPg==";

export const metadata: Metadata = {
  // 1. Zmieniony NAPIS (tytuł strony)
  title: 'qJonathan - System rezerwacji zajęć',
  description: 'Korepetycje z fizyki i matematyki, darmowe materiały PDF, autorskie notatki i nagrania z lekcji. Buduj swoją przewagę.',
  
  // 2. Zmieniona EMOTKA (ikona z kodu)
  icons: {
    icon: GRADUATION_CAP_ICON_CODE, 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Ta linia wymusi nową ikonę z kodu, nawet jeśli na dysku jest stary plik favicon.ico */}
        <link rel="icon" href={GRADUATION_CAP_ICON_CODE} sizes="any" />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
