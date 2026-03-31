"use client";

export function Footer() {
  return (
    <footer className="bg-[#0b0f1a] text-gray-400 py-10 px-4 mt-auto border-t border-gray-800/50">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        
        {/* Główna sekcja z 3 kolumnami */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Kolumna 1: Logo i opis */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 text-white font-medium mb-3 text-lg">
              {/* Ikona czapki absolwenta */}
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              <span>Korepetycje Online</span>
            </div>
            <p className="text-sm text-gray-400">Korepetycje z fizyki i matematyki</p>
          </div>

          {/* Kolumna 2: Kontakt */}
          <div className="flex flex-col items-center">
            <h3 className="text-white font-medium mb-3">Kontakt</h3>
            <a href="tel:+48796305827" className="text-sm text-gray-400 hover:text-white transition-colors mb-2">
              +48 796 305 827
            </a>
            <a href="mailto:contact.qjonathan@gmail.com" className="text-sm text-gray-400 hover:text-white transition-colors">
              contact.qjonathan@gmail.com
            </a>
          </div>

          {/* Kolumna 3: Zasady i bezpieczeństwo */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-white font-medium mb-3">Zasady i bezpieczeństwo</h3>
            <a href="https://www.qjonathan.pl/warunki-swiadczenia-uslug" className="text-sm text-gray-400 hover:text-white transition-colors mb-2">
              Warunki świadczenia usług
            </a>
            <a href="https://www.qjonathan.pl/polityka-prywatnosci" className="text-sm text-gray-400 hover:text-white transition-colors">
              Polityka prywatności
            </a>
          </div>

        </div>

        {/* Dolna linia oddzielająca i prawa autorskie */}
        <div className="border-t border-gray-800/50 pt-6 text-center text-xs text-gray-500">
          © 2026 qJonathan.pl Wszelkie prawa zastrzeżone.
        </div>
        
      </div>
    </footer>
  );
}