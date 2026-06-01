import React from 'react';
import { ArrowLeft, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';

interface TermsProps {
  onBack: () => void;
}

export default function Terms({ onBack }: TermsProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-left bg-white rounded-2xl border border-slate-100 shadow-xs">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Powrót do strony głównej
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-5.5 h-5.5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Warunki Świadczenia Usług
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">Ostatnia aktualizacja: 1 czerwca 2026 r.</p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-6 leading-relaxed">
        <section>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="text-blue-600">1.</span> Postanowienia ogólne
          </h2>
          <p>
            Niniejszy regulamin określa zasady korzystania z formularza rezerwacji oraz świadczenia usług korepetycji z przedmiotów ścisłych (fizyka i matematyka) udostępnianych za pośrednictwem platformy Korepetycje Online pod domeną qJonathan.pl. Korepetycje prowadzone są przez wykwalifikowanych tutorów indywidualnych.
          </p>
        </section>

        <section>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="text-blue-600">2.</span> Rezerwacja i zapis
          </h2>
          <p>
            Rezerwacja chęci udziału w korepetycjach następuje poprzez poprawne wypełnienie i wysłanie formularza kontaktowego na stronie głównej. Wysłanie formularza nie jest równoznaczne z automatyczną rezerwacją terminu lekcji. Po otrzymaniu rezerwacji skontaktujemy się z Państwem telefonicznie lub e-mailowo w celu ustalenia ostatecznych terminów oraz warunków współpracy.
          </p>
        </section>

        <section>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="text-blue-600">3.</span> Odwoływanie zajęć
          </h2>
          <p>
            Uczeń lub jego opiekun prawny ma prawo do bezpłatnego odwołania zaplanowanej lekcji najpóźniej na 24 godziny przed jej rozpoczęciem. Lekcje odwołane później lub nieobecności bez zapowiedzi mogą podlegać opłacie i są rozpatrywane indywidualnie.
          </p>
        </section>

        <section>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="text-blue-600">4.</span> Odpowiedzialność i wymagania sprzętowe
          </h2>
          <p>
            Zajęcia online wymagają sprawnego sprzętu komputerowego z dostępem do mikrofonu, stabilnego łącza internetowego oraz kamery internetowej (zalecanej w celach dydaktycznych). Dokładamy najwyższych starań, aby zajęcia przebiegały merytorycznie i bez zakłóceń, jednak nie ponosimy odpowiedzialności za problemy techniczne leżące po stronie ucznia.
          </p>
        </section>

        <section>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="text-blue-600">5.</span> Reklamacje i kontakt
          </h2>
          <p>
            Wszelkie uwagi, zastrzeżenia lub reklamacje dotyczące organizacji zajęć i sposobu ich prowadzenia należy kierować bezpośrednio na nasz adres mailowy: <a href="mailto:contact.qjonathan@gmail.com" className="text-blue-600 underline font-medium hover:text-blue-700">contact.qjonathan@gmail.com</a>. Odpowiemy na każdą wiadomość i dołożymy starań, aby rozwiązać zaistniałe spory polubownie.
          </p>
        </section>
      </div>
    </div>
  );
}
