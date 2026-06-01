import React from 'react';
import { ArrowLeft, KeyRound, Eye, ShieldCheck } from 'lucide-react';

interface PrivacyProps {
  onBack: () => void;
}

export default function Privacy({ onBack }: PrivacyProps) {
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
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
          <KeyRound className="w-5.5 h-5.5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Polityka Prywatności
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">Ostatnia aktualizacja: 1 czerwca 2026 r.</p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-6 leading-relaxed">
        <section>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="text-emerald-600">1.</span> Administrator danych osobowych
          </h2>
          <p>
            Administratorem Państwa danych osobowych zbieranych w formularzu rezerwacji jest serwis qJonathan.pl. Dbamy o najwyższe standardy poufności i bezpieczeństwa, implementując zabezpieczenia szyfrujące oraz restrykcyjny dostęp administracyjny do bazy.
          </p>
        </section>

        <section>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="text-emerald-600">2.</span> Cel i podstawa prawna przetwarzania
          </h2>
          <p>
            Państwa dane osobowe (imię, adres e-mail, numer telefonu, wybrany przedmiot, poziom edukacji itp.) są przetwarzane w celach:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Rejestracji rezerwacji i weryfikacji wolnych terminów na korepetycje.</li>
            <li>Kontaktu telefonicznego bądź e-mailowego w sprawach lekcji.</li>
            <li>Przekazywania błyskawicznych powiadomień wewnętrznych za pomocą szyfrowanych webhooków Discord do koordynatorów.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="text-emerald-600">3.</span> Prawa osób, których dane dotyczą
          </h2>
          <p>
            Każdej osobie, która podaje swoje dane, przysługuje prawo dostępu do nich, prawo sprostowania, usunięcia ("prawo do bycia zapomnianym"), ograniczenia przetwarzania, a także prawo wzniesienia sprzeciwu. W celu usunięcia bądź modyfikacji swoich rezerwacji prosimy o bezpośredni kontakt mailowy na adres <a href="mailto:contact.qjonathan@gmail.com" className="text-blue-600 underline hover:text-blue-700">contact.qjonathan@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="text-emerald-600">4.</span> Czas przechowywania danych
          </h2>
          <p>
            Dane osobowe zgromadzone w formularzu będą przechowywane przez okres niezbędny do zrealizowania kontaktu dydaktycznego, nie dłużej jednak niż do momentu zażądania ich usunięcia przez użytkownika.
          </p>
        </section>

        <section>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="text-emerald-600">5.</span> Pliki cookie i dane eksploatacyjne
          </h2>
          <p>
            Strona korzysta z plików cookie oraz pamięci lokalnej przeglądarki (localStorage) w celu zapisywania konfiguracji aplikacji, ułatwiania nawigacji oraz poprawnego funkcjonowania systemu rezerwacji. Dane te nie są przekazywane firmom trzecim ani wykorzystywane do celów reklamowych.
          </p>
        </section>
      </div>
    </div>
  );
}
