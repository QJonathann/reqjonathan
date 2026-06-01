/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Users,
  ArrowLeft,
  Clock,
  Check
} from 'lucide-react';
import { SubjectType, EducationLevel, TutoringApplication } from '../types';
import InteractiveCalendar from './InteractiveCalendar';

interface TutoringFormProps {
  onSubmit: (newApp: Omit<TutoringApplication, 'id' | 'status' | 'dateCreated' | 'notes'>) => void;
}

export default function TutoringForm({ onSubmit }: TutoringFormProps) {
  // Mode selection state: student or parent (two-step form flow)
  const [role, setRole] = useState<'uczen' | 'rodzic' | null>(null);

  // Form fields states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [subject, setSubject] = useState<SubjectType>('matematyka');
  const [level, setLevel] = useState<EducationLevel>('srednia');
  const [preferredTimes, setPreferredTimes] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(1);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [showCalendarHelper, setShowCalendarHelper] = useState(false);

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Validate form before submission
  const validateForm = (): boolean => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) {
      tempErrors.name = 'Imię i nazwisko jest wymagane.';
    } else if (name.trim().length < 4) {
      tempErrors.name = 'Podaj pełne imię i nazwisko (min. 4 znaki).';
    }

    if (role === 'rodzic') {
      // Validate parent details
      if (!parentEmail.trim()) {
        tempErrors.parentEmail = 'Adres e-mail rodzica jest wymagany.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
        tempErrors.parentEmail = 'Podaj poprawny adres e-mail rodzica.';
      }

      if (!parentPhone.trim()) {
        tempErrors.parentPhone = 'Numer telefonu rodzica jest wymagany.';
      } else if (!/^[0-9+\s-]{9,15}$/.test(parentPhone)) {
        tempErrors.parentPhone = 'Podaj poprawny numer telefonu rodzica (np. 500 600 700).';
      }

      // Validate student details optional format
      if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        tempErrors.email = 'Podaj poprawny adres e-mail ucznia.';
      }

      if (phone.trim() && !/^[0-9+\s-]{9,15}$/.test(phone)) {
        tempErrors.phone = 'Podaj poprawny numer telefonu ucznia.';
      }
    } else {
      // Validate student details as required
      if (!email.trim()) {
        tempErrors.email = 'Adres e-mail jest wymagany.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        tempErrors.email = 'Podaj poprawny adres e-mail.';
      }

      if (!phone.trim()) {
        tempErrors.phone = 'Numer telefonu jest wymagany.';
      } else if (!/^[0-9+\s-]{9,15}$/.test(phone)) {
        tempErrors.phone = 'Podaj poprawny numer telefonu (np. 500 600 700).';
      }
    }

    if (!preferredTimes.trim()) {
      tempErrors.preferredTimes = 'Określenie wolnych terminów ułatwi nam kontakt.';
    }

    if (additionalInfo.trim() && additionalInfo.trim().length < 10) {
      tempErrors.additionalInfo = 'Opis powinien mieć przynajmniej 10 znaków.';
    }

    if (!acceptedPolicy) {
      tempErrors.acceptedPolicy = 'Musisz zaakceptować warunki świadczenia usług i politykę prywatności, aby kontynuować.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Prepend role description so it's transparently saved and sent to Discord
    const rolePrefix = role === 'rodzic' ? '[Zgłoszenie od Rodzica] ' : '[Zgłoszenie od Ucznia] ';

    // Send application data to parent
    onSubmit({
      studentName: name,
      studentEmail: email.trim(),
      studentPhone: phone.trim(),
      parentEmail: role === 'rodzic' ? parentEmail.trim() : undefined,
      parentPhone: role === 'rodzic' ? parentPhone.trim() : undefined,
      subject,
      level,
      preferredTimes,
      hoursPerWeek,
      additionalInfo: rolePrefix + additionalInfo
    });

    // Clear form fields
    setName('');
    setEmail('');
    setPhone('');
    setParentEmail('');
    setParentPhone('');
    setSubject('matematyka');
    setLevel('srednia');
    setPreferredTimes('');
    setHoursPerWeek(1);
    setAcceptedPolicy(false);
    setAdditionalInfo('');
    setErrors({});

    // Pop up success overlay
    setShowSuccessNotification(true);
  };

  return (
    <div id="tutoring-form-container" className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
      
      {/* Dynamic Success Notification Overlay */}
      {showSuccessNotification ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex flex-col items-center justify-center p-8 md:p-12 text-center"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-blue-600 animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Rezerwacja została wysłana!</h3>
          <p className="text-slate-600 max-w-sm text-sm">
            Rezerwacja została wysłana do korepetytora. Potwierdzenie wysłania rezerwacji zostało wysłane na maila, a w niedalekiej przyszłości odezwę się na maila z potwierdzeniem dokładnego terminu zajęć.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-sm justify-center">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowSuccessNotification(false);
                setRole(null);
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-600/10 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer text-center flex-1"
            >
              Wyślij kolejną rezerwację
            </motion.button>
            <a
              href="https://www.qjonathan.pl"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer text-center flex-1 inline-flex items-center justify-center border border-slate-200/50"
            >
              Powrót do qjonathan.pl
            </a>
          </div>
        </motion.div>
      ) : role === null ? (
        <div className="flex flex-col">
          {/* Header of Form Panel */}
          <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5.5 h-5.5 text-blue-600" />
              Zapisz się na korepetycje
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Chcesz rozwinąć swoje umiejętności naukowe? Na początek powiedz nam, kto dokonuje rezerwacji.
            </p>
          </div>

          {/* Role Choice Cards */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Card 1: Student */}
              <button
                type="button"
                onClick={() => setRole('uczen')}
                className="flex flex-col items-center sm:items-start text-center sm:text-left p-6 bg-white border border-slate-200 hover:border-blue-500 rounded-2xl transition-all cursor-pointer group hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 transform -translate-y-1 group-hover:translate-y-0 transition-transform duration-250" />
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors">
                  Jestem Uczniem
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  Szukam lekcji dla siebie, chcę przygotować się do lekcji, sprawdzianów lub egzaminu.
                </p>
              </button>

              {/* Card 2: Parent */}
              <button
                type="button"
                onClick={() => setRole('rodzic')}
                className="flex flex-col items-center sm:items-start text-center sm:text-left p-6 bg-white border border-slate-200 hover:border-blue-500 rounded-2xl transition-all cursor-pointer group hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 transform -translate-y-1 group-hover:translate-y-0 transition-transform duration-250" />
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors">
                  Jestem Rodzicem
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  Szukam profesjonalnego wsparcia dla mojego dziecka i chcę pomóc mu zdobyć lepsze oceny.
                </p>
              </button>

            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header of Form Panel */}
          <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5.5 h-5.5 text-blue-600" />
                {role === 'uczen' ? 'Zgłoszenie Ucznia' : 'Zgłoszenie Rodzica'}
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                {role === 'uczen' 
                  ? 'Krok 2: Wypełnij formularz swoimi danymi kontaktowymi.' 
                  : 'Krok 2: Podaj swoje dane kontaktowe oraz informacje o uczniu.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setRole(null);
                setErrors({});
              }}
              className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Zmień rolę ({role === 'uczen' ? 'Uczeń' : 'Rodzic'})
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
            
            {/* Student Name */}
            <div>
              <label htmlFor="student-name" className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                {role === 'uczen' ? 'Imię i nazwisko' : 'Imię i nazwisko ucznia (dziecka)'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="student-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'uczen' ? 'np. Jan Kowalski' : 'np. Adam Kowalski'}
                  className={`w-full bg-white border ${
                    errors.name 
                      ? 'border-rose-400 focus:ring-rose-500' 
                      : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
                  } rounded-xl py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-40 transition-all`}
                />
              </div>
              {errors.name && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Contact info grid: Email and Phone based on Role */}
            {role === 'uczen' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label htmlFor="student-email" className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Adres e-mail <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="student-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="np. jankowalski@gmail.com"
                    className={`w-full bg-white border ${
                      errors.email 
                        ? 'border-rose-400 focus:ring-rose-500' 
                        : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
                    } rounded-xl py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-40 transition-all`}
                  />
                  {errors.email && (
                    <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="student-phone" className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-blue-600" />
                    Numer telefonu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="student-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="np. 500 600 700 / +48 ..."
                    className={`w-full bg-white border ${
                      errors.phone 
                        ? 'border-rose-400 focus:ring-rose-500' 
                        : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
                    } rounded-xl py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-40 transition-all`}
                  />
                  {errors.phone && (
                    <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Parent contact info section (required) */}
                <div className="bg-blue-50/30 rounded-2xl p-5 border border-blue-100 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 border border-blue-200 rounded px-2 py-0.5 tracking-wider uppercase">
                      Dane Rodzica / Opiekuna (Kontaktowe)
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Parent Email */}
                    <div>
                      <label htmlFor="parent-email" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        Adres e-mail Rodzica <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="parent-email"
                        type="email"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        placeholder="np. rodzic.kowalski@gmail.com"
                        className={`w-full bg-white border ${
                          errors.parentEmail 
                            ? 'border-rose-400 focus:ring-rose-500' 
                            : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
                        } rounded-xl py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-40 transition-all`}
                      />
                      {errors.parentEmail && (
                        <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.parentEmail}
                        </p>
                      )}
                    </div>

                    {/* Parent Phone */}
                    <div>
                      <label htmlFor="parent-phone" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        Numer telefonu Rodzica <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="parent-phone"
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="np. 500 600 700"
                        className={`w-full bg-white border ${
                          errors.parentPhone 
                            ? 'border-rose-400 focus:ring-rose-500' 
                            : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
                        } rounded-xl py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-40 transition-all`}
                      />
                      {errors.parentPhone && (
                        <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.parentPhone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Student contact info section (optional) */}
                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-200/50 space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 border border-slate-300 rounded px-2 py-0.5 tracking-wider uppercase">
                      Dane Kontaktowe Ucznia / Dziecka (Opcjonalne)
                    </span>
                    <span className="text-[10px] text-slate-500 italic">Podaj, jeśli uczeń we własnym zakresie umawia lekcje</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Student Email */}
                    <div>
                      <label htmlFor="student-email-rodzic" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        Adres e-mail Ucznia
                      </label>
                      <input
                        id="student-email-rodzic"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="np. jankowalski@gmail.com"
                        className={`w-full bg-white border ${
                          errors.email 
                            ? 'border-rose-400 focus:ring-rose-500' 
                            : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
                        } rounded-xl py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-40 transition-all`}
                      />
                      {errors.email && (
                        <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Student Phone */}
                    <div>
                      <label htmlFor="student-phone-rodzic" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        Numer telefonu Ucznia
                      </label>
                      <input
                        id="student-phone-rodzic"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="np. 500 600 700"
                        className={`w-full bg-white border ${
                          errors.phone 
                            ? 'border-rose-400 focus:ring-rose-500' 
                            : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
                        } rounded-xl py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-40 transition-all`}
                      />
                      {errors.phone && (
                        <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tutoring specific: Subject and Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Subject Select */}
              <div>
                <label htmlFor="student-subject" className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Przedmiot nauki
                </label>
                <select
                  id="student-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectType)}
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-blue-600 rounded-xl py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-opacity-40 transition-all font-sans"
                >
                  <option value="matematyka">Matematyka</option>
                  <option value="fizyka">Fizyka</option>
                  <option value="biologia">Biologia</option>
                  <option value="informatyka">Informatyka</option>
                </select>
              </div>

              {/* Education Level */}
              <div>
                <label htmlFor="student-level" className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  {role === 'uczen' ? 'Poziom edukacji' : 'Poziom edukacji dziecka'}
                </label>
                <select
                  id="student-level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as EducationLevel)}
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-blue-600 rounded-xl py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-opacity-40 transition-all font-sans"
                >
                  <option value="podstawowa">Szkoła Podstawowa</option>
                  <option value="srednia">Szkoła Średnia (Liceum/Technikum)</option>
                  <option value="studia">Studia Wyższe</option>
                </select>
              </div>
            </div>

            {/* Pick hours per week */}
            <div className="bg-slate-50/50 rounded-xl p-3.5 border border-slate-200/50 space-y-2">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Planowana liczba godzin w tygodniu <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((h) => {
                  const isSelected = hoursPerWeek === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHoursPerWeek(h)}
                      className={`relative py-2 px-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 text-blue-900 shadow-sm font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-lg font-black text-slate-900">{h === 4 ? '4+' : h}</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                        {h === 1 ? 'godz.' : (h === 4 ? 'godz.+' : 'godz.')}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-0.5 text-white">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred times */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label htmlFor="student-preferred-times" className="block text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Preferowane terminy <span className="text-rose-500">*</span>
                </label>
                
                <button
                  type="button"
                  onClick={() => setShowCalendarHelper(!showCalendarHelper)}
                  className={`text-xs font-bold py-1 px-2.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    showCalendarHelper 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {showCalendarHelper ? 'Ukryj kalendarz ✕' : '📅 Wybierz z kalendarza'}
                </button>
              </div>

              {showCalendarHelper && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4"
                >
                  <InteractiveCalendar 
                    value={preferredTimes}
                    onChange={(val) => setPreferredTimes(val)}
                  />
                </motion.div>
              )}

              <input
                id="student-preferred-times"
                type="text"
                value={preferredTimes}
                onChange={(e) => setPreferredTimes(e.target.value)}
                placeholder="np. wtorki i czwartki po 16:00, weekendy rano (lub wybierz wyżej z kalendarza)"
                className={`w-full bg-white border ${
                  errors.preferredTimes 
                    ? 'border-rose-400 focus:ring-rose-500' 
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
                } rounded-xl py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-40 transition-all`}
              />
              <p className="text-[11px] text-slate-400 italic">
                Wskazówka: Możesz edytować ten tekst ręcznie w dowolnej chwili lub klikać pozycje w kalendarzu powyżej.
              </p>
              <div className="bg-amber-50/60 border border-amber-200/50 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2.5 leading-relaxed">
                <span className="text-amber-650 text-base shrink-0 select-none">⚠️</span>
                <span>
                  <strong>Ważna informacja:</strong> Wybrane przez Ciebie terminy mają charakter <strong>orientacyjny</strong>. Po przesłaniu zgłoszenia przeanalizuję grafik i skontaktuję się z Tobą telefonicznie lub mailowo, aby ostatecznie <strong>potwierdzić dokładne godziny</strong> zajęć.
                </span>
              </div>
              {errors.preferredTimes && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.preferredTimes}
                </p>
              )}
            </div>

            {/* Additional info / detailed requirements */}
            <div>
              <label htmlFor="student-additional-info" className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                {role === 'uczen' ? 'Opisz z czym masz trudności lub jaki masz cel' : 'W czym możemy pomóc? Opisz wyzwania lub cel dziecka'} <span className="text-slate-400 text-xs font-normal ml-1">(opcjonalnie)</span>
              </label>
              <textarea
                id="student-additional-info"
                rows={4}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder={role === 'uczen' ? 'np. Chcę się przygotować do matury / chcę napisać dobrze kolokwium na studiach...' : 'np. Chcę pomóc córce przygotować się do matury / syn chce napisać dobrze kolokwium na studiach...'}
                className={`w-full bg-white border ${
                  errors.additionalInfo 
                    ? 'border-rose-400 focus:ring-rose-500' 
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
                } rounded-xl py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-40 transition-all font-sans`}
              />
              {errors.additionalInfo && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.additionalInfo}
                </p>
              )}
            </div>

            {/* Agreement Policy Checkbox */}
            <div className="bg-slate-50/30 rounded-lg p-2.5 border border-slate-200/40 space-y-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={acceptedPolicy}
                  onChange={(e) => setAcceptedPolicy(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer focus:ring-offset-0"
                />
                <span className="leading-snug font-sans text-[11px]">
                  Dokonując rezerwacji akceptuję{' '}
                  <a
                    href="https://www.qjonathan.pl/warunki-swiadczenia-uslug"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-bold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    warunki świadczenia usług
                  </a>{' '}
                  oraz{' '}
                  <a
                    href="https://www.qjonathan.pl/polityka-prywatnosci"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-bold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    politykę prywatności
                  </a>
                  . <span className="text-rose-500 font-bold">*</span>
                </span>
              </label>
              {errors.acceptedPolicy && (
                <p className="text-rose-500 text-[10px] mt-1 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3 h-3 text-rose-500" />
                  {errors.acceptedPolicy}
                </p>
              )}
            </div>

            {/* Clean dynamic submit button with requested styles */}
            <motion.button
              id="submit-form-button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-white" />
              Wyślij rezerwację na korepetycje
            </motion.button>

          </form>
        </motion.div>
      )}
    </div>
  );
}
