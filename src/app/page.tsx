"use client";

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, GraduationCap, ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, CalendarDays, MessageSquare, User } from 'lucide-react';
import { format, startOfToday, isValid, addMonths, subMonths } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const mockSlots = [
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const subjects = [
  { id: 'math-primary', name: 'Matematyka - podstawówka', level: 'Podstawowa' },
  { id: 'math-secondary', name: 'Matematyka - szkoła średnia', level: 'Średnia' },
  { id: 'phys-primary', name: 'Fizyka - podstawówka', level: 'Podstawowa' },
  { id: 'phys-secondary', name: 'Fizyka - szkoła średnia', level: 'Średnia' },
];

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  
  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [step, setStep] = useState(1);
  const [today, setToday] = useState<Date | null>(null);
  const { toast } = useToast();

  const handlePrevMonth = () => setMonth(subMonths(month, 1));
  const handleNextMonth = () => setMonth(addMonths(month, 1));

  useEffect(() => {
    setToday(startOfToday());
  }, []);

const handleBooking = async () => {
    // 1. Walidacja pól
    if (!date || !selectedSlot || !selectedSubject || !parentName || !studentName || !email || !phone) {
      toast({
        title: "Błąd",
        description: "Proszę wypełnić wszystkie wymagane pola.",
        variant: "destructive"
      });
      return;
    }

    // 2. Pobranie URL ze zmiennej środowiskowej (z przedrostkiem NEXT_PUBLIC_)
    const DISCORD_WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;

    if (!DISCORD_WEBHOOK_URL) {
      toast({
        title: "Błąd konfiguracji",
        description: "System nie znalazł adresu Webhooka. Sprawdź ustawienia Vercel.",
        variant: "destructive"
      });
      return;
    }

    const discordMessage = {
      username: "System Rezerwacji",
      embeds: [{
        title: "📅 Nowa rezerwacja lekcji!",
        color: 3447003, // Kolor niebieski
        fields: [
          { name: "Uczeń", value: studentName, inline: true },
          { name: "Rodzic", value: parentName, inline: true },
          { name: "E-mail", value: email, inline: true },
          { name: "Telefon", value: phone, inline: true },
          { name: "Data", value: format(date, 'd MMMM yyyy', { locale: pl }), inline: true },
          { name: "Godzina", value: selectedSlot, inline: true },
          { name: "Przedmiot", value: subjects.find(s => s.id === selectedSubject)?.name || "Nieznany", inline: false },
          { name: "Opis", value: description || "Brak dodatkowego opisu", inline: false },
        ],
        footer: { text: "qJonathan.pl - System Rezerwacji" },
        timestamp: new Date().toISOString(),
      }]
    };

    try {
      // 3. Wysyłka danych Webhookiem
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordMessage),
      });

      if (response.ok) {
        setStep(3); // Przejdź do ekranu sukcesu
      } else {
        throw new Error("Discord API error");
      }
    } catch (error) {
      toast({
        title: "Błąd wysyłki",
        description: "Nie udało się przesłać rezerwacji do systemu. Spróbuj ponownie.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navigation />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">Zarezerwuj Swoją Lekcję</h1>
            <p className="text-gray-500 text-lg">Wybierz dogodny termin i zacznij budować swoją przewagę.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {step < 3 && (
              <>
                <div className="lg:col-span-8 space-y-8">
                  <Card className="border-none shadow-sm overflow-hidden bg-white rounded-[2.5rem]">
                    <CardHeader className="bg-primary/5 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                          <CalendarDays className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">1. Wybierz datę</CardTitle>
                          <CardDescription>Dostępne terminy od poniedziałku do soboty</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-10 flex justify-center">
                      <div className="w-full max-w-sm border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white">
                        
                        {/* WŁASNY NAGŁÓWEK KALENDARZA */}
                        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100 bg-white">
                          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 cursor-pointer">
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          
<div className="flex flex-col items-center">
  <span className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none mb-1">
    {/* ZMIANA: 'MMMM' na 'LLLL' */}
    {format(month, 'LLLL', { locale: pl })}
  </span>
  <span className="text-[10px] font-bold text-gray-400 leading-none">
    {format(month, 'yyyy', { locale: pl })}
  </span>
</div>

                          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 cursor-pointer">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>

{/* WŁAŚCIWA SIATKA KALENDARZA */}
                        <Calendar
                          mode="single"
                          selected={date}
                          month={month}
                          onMonthChange={setMonth}
                          onSelect={(d) => { 
                            setDate(d); 
                            setSelectedSlot(null);
                            setSelectedSubject(null);
                            if (d) setMonth(d);
                          }}
                          className="w-full"
                          locale={pl}
                          disabled={(d) => (today ? d < today : false) || d.getDay() === 0}
                          // DODAJEMY TO PONIŻEJ:
                          classNames={{
                            caption: "hidden",        // Ukrywa cały stary kontener nagłówka
                            month_caption: "hidden",  // Dodatkowe zabezpieczenie dla niektórych wersji
                            nav: "hidden",            // Ukrywa stare strzałki
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {date && (
                    <div className="grid md:grid-cols-2 gap-8">
                      <Card className="border-none shadow-sm rounded-[2.5rem] bg-white">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            2. Godzina
                          </CardTitle>
                          <CardDescription>Dostępne terminy</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-3">
                            {mockSlots.map((slot) => (
                              <Button
                                key={slot}
                                variant={selectedSlot === slot ? "default" : "outline"}
                                className={cn(
                                  "h-12 rounded-2xl text-base font-bold transition-all",
                                  selectedSlot === slot 
                                    ? "shadow-lg shadow-primary/20 scale-105" 
                                    : "bg-white hover:border-primary/50 hover:bg-primary/5 border-gray-100"
                                )}
                                onClick={() => setSelectedSlot(slot)}
                              >
                                {slot}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-none shadow-sm rounded-[2.5rem] bg-white">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            3. Przedmiot
                          </CardTitle>
                          <CardDescription>Wybierz zakres</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {subjects.map((s) => (
                            <button
                              key={s.id}
                              disabled={!selectedSlot}
                              onClick={() => setSelectedSubject(s.id)}
                              className={cn(
                                "w-full flex flex-col items-start p-4 rounded-3xl border-2 transition-all text-left outline-none",
                                !selectedSlot ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
                                selectedSubject === s.id 
                                  ? "border-primary bg-primary/5" 
                                  : "border-gray-50 hover:border-primary/30 bg-white"
                              )}
                            >
                              <span className="text-sm font-bold text-gray-900">{s.name}</span>
                              <Badge variant="secondary" className="text-[9px] uppercase font-bold mt-1">{s.level}</Badge>
                            </button>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {selectedSubject && (
                    <div className="grid md:grid-cols-2 gap-8">
                      <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            4. Dane kontaktowe
                          </CardTitle>
                          <CardDescription>Potrzebne do potwierdzenia</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="parentName">Imię i nazwisko rodzica</Label>
                            <Input id="parentName" placeholder="Jan Kowalski" className="rounded-xl" value={parentName} onChange={(e) => setParentName(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="studentName">Imię ucznia</Label>
                            <Input id="studentName" placeholder="Adam Kowalski" className="rounded-xl" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Adres e-mail</Label>
                            <Input id="email" type="email" placeholder="kontakt@example.com" className="rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Numer telefonu</Label>
                            <Input id="phone" placeholder="+48 000 000 000" className="rounded-xl" value={phone} onChange={(e) => setPhone(e.target.value)} />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            5. Opis zagadnień (opcjonalnie)
                          </CardTitle>
                          <CardDescription>Napisz, co chcesz omówić</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Textarea 
                            id="description"
                            placeholder="Np. Zadania z kinematyki..."
                            className="min-h-[260px] rounded-[1.5rem] border-gray-100 p-6 focus-visible:ring-1 text-sm"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 lg:sticky lg:top-32">
                  <Card className="border-none shadow-xl bg-primary text-white overflow-hidden rounded-[3rem]">
                    <div className="p-10">
                      <h3 className="text-2xl font-bold mb-8">Twoja rezerwacja</h3>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                          <span className="text-primary-foreground/60 text-xs font-bold uppercase tracking-wider">Data</span>
                          <span className="font-bold text-base">{date && isValid(date) ? format(date, 'd MMMM yyyy', { locale: pl }) : '—'}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                          <span className="text-primary-foreground/60 text-xs font-bold uppercase tracking-wider">Godzina</span>
                          <span className="font-bold text-base">{selectedSlot || '—'}</span>
                        </div>
                        <div className="flex justify-between items-start py-3 border-b border-white/10">
                          <span className="text-primary-foreground/60 text-xs font-bold uppercase tracking-wider">Przedmiot</span>
                          <span className="font-bold text-right text-sm ml-4">
                            {subjects.find(s => s.id === selectedSubject)?.name || '—'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-6">
                          <span className="text-xl font-bold">Koszt:</span>
                          <span className="text-3xl font-black">60 PLN</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-10 h-16 bg-white text-primary hover:bg-gray-100 font-black rounded-[1.5rem] text-xl group shadow-lg"
                        disabled={!date || !selectedSlot || !selectedSubject || !parentName || !studentName || !email || !phone}
                        onClick={handleBooking}
                      >
                        Zarezerwuj teraz
                        <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="lg:col-span-12 max-w-2xl mx-auto py-12">
                <Card className="border-none shadow-2xl overflow-hidden rounded-[3rem]">
                  <div className="bg-emerald-500 p-12 text-center text-white">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold mb-3">Zarezerwowano!</h2>
                    <p className="text-emerald-100 text-lg">Witaj {studentName}! Potwierdzenie wysłaliśmy na e-mail rodzica.</p>
                  </div>
                  <CardContent className="p-12 space-y-8 bg-white text-center">
                    <Button 
                      className="w-full h-16 rounded-[1.5rem] font-bold text-lg border-2" 
                      variant="outline"
                      onClick={() => {
                        setStep(1);
                        setDate(undefined);
                        setSelectedSlot(null);
                        setSelectedSubject(null);
                        setDescription('');
                        setParentName('');
                        setStudentName('');
                        setEmail('');
                        setPhone('');
                      }}
                    >
                      Zarezerwuj kolejną lekcję
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}