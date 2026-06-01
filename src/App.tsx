/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  GraduationCap, 
  Settings, 
  Info, 
  HeartHandshake,
  Bot,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  Shield,
  X,
  Cpu,
  Key
} from 'lucide-react';
import TutoringForm from './components/TutoringForm';
import ApplicationList from './components/ApplicationList';
import ApplicationDetailModal from './components/ApplicationDetailModal';
import DiscordIntegrationPanel from './components/DiscordIntegrationPanel';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import CookieBanner from './components/CookieBanner';
import { TutoringApplication, DiscordConfig, ApplicationStatus, SubjectType } from './types';
import { INITIAL_APPLICATIONS, SUBJECT_LABELS, LEVEL_LABELS } from './data';

export default function App() {
  const [applications, setApplications] = useState<TutoringApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<TutoringApplication | null>(null);
  
  // Admin UI state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'applications' | 'discord'>('applications');

  // Discord Integration State
  const [discordConfig, setDiscordConfig] = useState<DiscordConfig>({
    webhookUrl: '',
    isEnabled: true,
    username: 'Korepetycje Bot 🎓',
  });

  // Global notification banner for actions
  const [globalBanner, setGlobalBanner] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // Simple routing engine state
  const [currentPage, setCurrentPage] = useState<'home' | 'terms' | 'privacy'>('home');
  
  const pathMap: Record<string, 'home' | 'terms' | 'privacy'> = {
    '': 'home',
    '/': 'home',
    '/kontakt': 'home',          
    '/warunki-swiadczenia-uslug': 'terms', 
    '/terms': 'terms',
    '/polityka-prywatnosci': 'privacy', 
    '/privacy': 'privacy'
  };

  const pageToPath = {
    'home': '/',
    'terms': '/warunki-swiadczenia-uslug',
    'privacy': '/polityka-prywatnosci'
  };

  const handlePageChange = (newPage: 'home' | 'terms' | 'privacy') => {
    setCurrentPage(newPage);
    const path = pageToPath[newPage] || '/';
    window.history.pushState({ page: newPage }, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load state from localStorage on startup
  useEffect(() => {
    // 1. Applications load
    const savedApps = localStorage.getItem('tutoring_applications');
    if (savedApps) {
      try {
        setApplications(JSON.parse(savedApps));
      } catch (err) {
        console.error('Błąd podczas parsowania aplikacji z localStorage:', err);
        setApplications(INITIAL_APPLICATIONS);
      }
    } else {
      setApplications(INITIAL_APPLICATIONS);
    }

 // 2. Discord configuration load
    const savedConfig = localStorage.getItem('tutoring_discord_config');
    
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setDiscordConfig({
          webhookUrl: '', // Frontend nic nie wie o linku, serwer się tym zajmie!
          isEnabled: parsed.isEnabled !== undefined ? parsed.isEnabled : true,
          username: parsed.username || 'Korepetycje Bot 🎓',
        });
      } catch (err) {
        console.error('Błąd podczas parsowania konfiguracji Discord z localStorage:', err);
        setDiscordConfig({
          webhookUrl: '',
          isEnabled: true,
          username: 'Korepetycje Bot 🎓',
        });
      }
    } else {
      const defaultConf = {
        webhookUrl: '',
        isEnabled: true,
        username: 'Korepetycje Bot 🎓',
      };
      setDiscordConfig(defaultConf);
      localStorage.setItem('tutoring_discord_config', JSON.stringify(defaultConf));
    }

    // 3. Routing resolution on boot
    const pathname = decodeURI(window.location.pathname);
    const cleanPath = pathname === '/' ? '/' : pathname;
    const initialPage = pathMap[cleanPath] || 'home';
    setCurrentPage(initialPage);
    
    if (cleanPath === '/kontakt') {
      setTimeout(() => {
        document.getElementById('tutoring-form-container')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }

    const handlePopState = (e: PopStateEvent) => {
      const page = e.state?.page || 'home';
      setCurrentPage(page);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save applications list helper
  const saveApplications = (newApps: TutoringApplication[]) => {
    setApplications(newApps);
    localStorage.setItem('tutoring_applications', JSON.stringify(newApps));
  };

// Helper to construct and send webhook payload via Server API
  const sendDiscordWebhook = async (app: TutoringApplication, configToUse = discordConfig): Promise<boolean> => {
    // Sprawdzamy TYLKO, czy powiadomienia są włączone. Link nas na frontendzie nie obchodzi.
    if (!configToUse.isEnabled) {
      return false;
    }

    const subjectLabel = SUBJECT_LABELS[app.subject]?.label || app.subject;
    const levelLabel = LEVEL_LABELS[app.level] || app.level;

    // Build standard high-quality Discord embed structure with support for parent details
    const fields = [
      { name: '👤 Imię i nazwisko ucznia', value: `**${app.studentName}**`, inline: true },
    ];

    if (app.parentEmail || app.parentPhone) {
      fields.push({ name: '👤 Rola zgłaszającego', value: '👪 Rodzic / Opiekun', inline: true });
      fields.push({ name: '📧 E-mail rodzica', value: app.parentEmail || 'Brak', inline: true });
      fields.push({ name: '📞 Telefon rodzica', value: app.parentPhone || 'Brak', inline: true });
      fields.push({ name: '📧 E-mail ucznia', value: app.studentEmail || 'Nie podano', inline: true });
      fields.push({ name: '📞 Telefon ucznia', value: app.studentPhone || 'Nie podano', inline: true });
    } else {
      fields.push({ name: '👤 Rola zgłaszającego', value: '🎓 Uczeń', inline: true });
      fields.push({ name: '📧 E-mail ucznia', value: app.studentEmail || 'Brak', inline: true });
      fields.push({ name: '📞 Telefon ucznia', value: app.studentPhone || 'Brak', inline: true });
    }

    fields.push(
      { name: '📚 Przedmiot', value: `**${subjectLabel}**`, inline: true },
      { name: '🏫 Poziom edukacji', value: levelLabel, inline: true },
      { name: '⏱️ Liczba godzin/tydzień', value: `**${app.hoursPerWeek || 1} godz.**`, inline: true },
      { name: '📅 Preferowane terminy', value: app.preferredTimes, inline: false },
      { name: '📝 Cel nauki i szczegóły', value: app.additionalInfo, inline: false }
    );

    const payload = {
      username: configToUse.username || 'Korepetycje Bot 🎓',
      embeds: [
        {
          title: '🎓 Nowe Zgłoszenie na Korepetycje!',
          description: `Wpłynęło nowe podanie o naukę z Twojego portalu dla ID: **${app.id}**.`,
          color: 2449323, // 2563eb / #2563eb in base 10
          fields,
          timestamp: new Date().toISOString(),
          footer: {
            text: `System Korepetycji • ID: ${app.id}`
          }
        }
      ]
    };

    try {
      // Frontend wysyła zapytanie DO TWOJEGO BEZPIECZNEGO FOLDERU API
      const response = await fetch('/api/send-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Zauważ, że nie wysyłamy tu już "webhookUrl", tylko samą treść!
        body: JSON.stringify({ payload })
      });

      const data = await response.json();
      return data.success;
    } catch (err) {
      console.error('Nie udało się przekazać webhooka do serwera proxy:', err);
      return false;
    }
  };
  // Trigger test webhook message
  const handleTestWebhook = async (configToUse: DiscordConfig): Promise<boolean> => {
    const payload = {
      username: configToUse.username || 'Korepetycje Bot 🎓',
      embeds: [
        {
          title: '✅ Powiadomienia Discord gotowe do pracy!',
          description: 'Gratulacje! Twój serwer poprawnie autoryzował webhooka.',
          color: 2449323, // 2563eb
          fields: [
            { name: 'Status integracji', value: '● Aktywna i sprawna', inline: true },
            { name: 'Środowisko', value: 'Google AI Studio Applet Server', inline: true }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'System Korepetycji • Test połączenia'
          }
        }
      ]
    };

    try {
      const response = await fetch('/api/send-', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Url: configToUse.Url,
          payload
        })
      });

      const data = await response.json();
      return data.success;
    } catch (err) {
      console.error('Błąd podczas wysyłania testu a:', err);
      return false;
    }
  };

  // Save new Discord settings
  const handleSaveDiscordConfig = (newConfig: DiscordConfig) => {
    setDiscordConfig(newConfig);
    localStorage.setItem('tutoring_discord_config', JSON.stringify(newConfig));
    showBanner(true, 'Zapisano pomyślnie konfigurację Discord .');
  };

  // Create/Submit new application
  const handleCreateApplication = async (newAppData: Omit<TutoringApplication, 'id' | 'status' | 'dateCreated' | 'notes'>) => {
    const freshApp: TutoringApplication = {
      ...newAppData,
      id: `KOR-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      dateCreated: new Date().toISOString(),
      notes: [
        {
          id: `sys-n-${Date.now()}`,
          author: 'System',
          content: 'Zgłoszenie pomyślnie zarejestrowane w bazie danych.',
          dateCreated: new Date().toISOString()
        }
      ]
    };

    const updated = [freshApp, ...applications];
    saveApplications(updated);

    // If Discord  is configured, pass it immediately!
    if (discordConfig.isEnabled && discordConfig.Url) {
      const success = await sendDiscord(freshApp);
      if (success) {
        showBanner(true, `Pomyślnie zarejestrowano nową rezerwację od ucznia (${freshApp.studentName}).`);
      } else {
        showBanner(false, 'Rezerwację zapisano lokalnie, lecz wystąpił błąd podczas wysyłania powiadomienia.');
      }
    }
  };

  // Update applicant recruitment status
  const handleUpdateStatus = (id: string, status: ApplicationStatus) => {
    const statusLabelsPl = {
      pending: 'Oczekujące',
      accepted: 'Zaakceptowane',
      rejected: 'Odrzucone'
    };

    const updated = applications.map((app) => {
      if (app.id === id) {
        const sysNote = {
          id: `sys-n-${Date.now()}`,
          author: 'System',
          content: `Zmieniono status rezerwacji na: ${statusLabelsPl[status]}.`,
          dateCreated: new Date().toISOString()
        };
        return {
          ...app,
          status,
          notes: [...app.notes, sysNote]
        };
      }
      return app;
    });

    saveApplications(updated);

    // Sync state in details modal
    if (selectedApp && selectedApp.id === id) {
      const match = updated.find(a => a.id === id);
      if (match) setSelectedApp(match);
    }

    showBanner(true, `Zaktualizowano status rezerwacji na: ${statusLabelsPl[status]}`);
  };

  // Add internal annotation note
  const handleAddNote = (id: string, content: string) => {
    const updated = applications.map((app) => {
      if (app.id === id) {
        return {
          ...app,
          notes: [
            ...app.notes,
            {
              id: `tutor-n-${Date.now()}`,
              author: 'Organizator / Tutor',
              content,
              dateCreated: new Date().toISOString()
            }
          ]
        };
      }
      return app;
    });

    saveApplications(updated);

    if (selectedApp && selectedApp.id === id) {
      const match = updated.find(a => a.id === id);
      if (match) setSelectedApp(match);
    }
  };

  // Delete tutor application
  const handleDeleteApplication = (id: string) => {
    const updated = applications.filter(a => a.id !== id);
    saveApplications(updated);
    setSelectedApp(null);
    showBanner(true, 'Pomyślnie usunięto rezerwację z bazy danych.');
  };

  // Trigger manual resend of tutoring detail onto Discord 
  const handleManualResendDiscord = async (app: TutoringApplication) => {
    if (!discordConfig.Url) {
      alert('Aby wysłać rezerwację, musisz najpierw skonfigurować i włączyć integrację Discord w panelu na dole.');
      return;
    }

    const success = await sendDiscord(app, { ...discordConfig, isEnabled: true });
    if (success) {
      showBanner(true, `Pomyślnie wysłano/powtórzono rezerwację ${app.id} na Discorda!`);
    } else {
      showBanner(false, 'Błąd podczas łączenia z Discordem. Sprawdź poprawność URL a w sekcji ustawień na dole strony.');
    }
  };

  // Helper banner trigger
  const showBanner = (isSuccess: boolean, text: string) => {
    setGlobalBanner({ isSuccess, text });
    setTimeout(() => {
      setGlobalBanner(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans tracking-tight text-slate-800 antialiased flex flex-col relative">
      
      {/* 1. Global Interactive Toast Notifications banner */}
      <AnimatePresence>
        {globalBanner && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
          >
            <div className={`p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 ${
              globalBanner.isSuccess 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {globalBanner.isSuccess ? (
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              )}
              <span>{globalBanner.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Top Navigation header styled exactly as the provided mockup image */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-45 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo and branding group */}
          <a 
            href="https://www.qjonathan.pl"
            className="flex items-center gap-3.5 text-left focus:outline-none cursor-pointer group"
          >
            <GraduationCap className="w-9 h-9 text-blue-600 shrink-0 group-hover:scale-102 transition-transform" />
            <div className="flex flex-col">
              <span className="text-base md:text-lg font-bold text-slate-900 tracking-tight leading-none mb-1 group-hover:text-blue-600 transition-colors">
                Korepetycje Online
              </span>
              <span className="text-[11px] text-slate-500 font-medium font-sans">
                Fizyka • Matematyka
              </span>
            </div>
          </a>

          {/* Action Links & Kontakt Button */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-7">
            <a
              href="https://ai.qjonathan.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>Asystent AI</span>
            </a>

            <a
              href="https://www.qjonathan.pl/kontakt"
              className="py-2.5 px-4 sm:px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all focus:outline-none cursor-pointer flex items-center justify-center text-center"
            >
              Kontakt
            </a>
          </div>

        </div>
      </header>

      {/* Main Grid Content Layout */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col justify-center">
        
        {currentPage === 'home' && (
          <div id="tutoring-form-container" className="space-y-6">
            <TutoringForm onSubmit={handleCreateApplication} />
          </div>
        )}

        {currentPage === 'terms' && (
          <Terms onBack={() => handlePageChange('home')} />
        )}

        {currentPage === 'privacy' && (
          <Privacy onBack={() => handlePageChange('home')} />
        )}

      </main>

      {/* Modern dark footer matching the mockup image design precisely */}
      <footer className="bg-[#0B0F19] text-slate-400 mt-16 pt-12 pb-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-10 text-center md:text-left">
            
            {/* Column 1: Branding and Motto */}
            <div className="space-y-3 flex flex-col items-center md:items-start text-center md:text-left">
              <a href="https://www.qjonathan.pl" className="flex items-center gap-2 group cursor-pointer">
                <GraduationCap className="w-5 h-5 text-blue-500 group-hover:scale-102 transition-transform" />
                <span className="text-sm font-bold text-white tracking-wide group-hover:text-blue-500 transition-colors">
                  Korepetycje Online
                </span>
              </a>
              <p className="text-xs text-slate-500">
                Korepetycje z fizyki i matematyki
              </p>
            </div>

            {/* Column 2: Contact Numbers/Emails */}
            <div className="space-y-3 flex flex-col items-center md:items-start">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Kontakt
              </span>
              <div className="flex flex-col space-y-2 text-xs text-slate-500">
                <a href="tel:+48796305827" className="hover:text-blue-500 transition-colors">
                  +48 796 305 827
                </a>
                <a href="mailto:contact.qjonathan@gmail.com" className="hover:text-blue-500 transition-colors">
                  contact.qjonathan@gmail.com
                </a>
              </div>
            </div>

            {/* Column 3: Terms and Policy */}
            <div className="space-y-3 flex flex-col items-center md:items-start">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Zasady i bezpieczeństwo
              </span>
              <div className="flex flex-col space-y-2 text-xs text-slate-500">
                <a 
                  href="https://www.qjonathan.pl/warunki-swiadczenia-uslug"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-colors text-left self-center md:self-start"
                >
                  Warunki świadczenia usług
                </a>
                <a 
                  href="https://www.qjonathan.pl/polityka-prywatnosci"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-colors text-left self-center md:self-start"
                >
                  Polityka prywatności
                </a>
              </div>
            </div>

          </div>

          {/* Dividing Border Line */}
          <div className="border-t border-slate-900 my-4" />

          {/* Copyright and Bottom Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600">
            <p className="mx-auto text-center">
              &copy; 2026 qJonathan.pl Wszelkie prawa zastrzeżone.
            </p>
            
            {/* Discrete admin trigger built so we don't pollute the visual design but keep functionality accessible */}
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="opacity-20 hover:opacity-80 transition-opacity text-slate-600 flex items-center gap-1 focus:outline-none cursor-pointer absolute bottom-2 right-2 sm:static"
              title="Panel administratora"
            >
              <Key className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>

        </div>
      </footer>

      {/* Admin Panel Modal Overlay Dialog */}
      <AnimatePresence>
        {isAdminOpen && (
          <div id="admin-panel-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-40 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-slate-50 rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full text-left overflow-hidden h-[90vh] flex flex-col"
            >
              {/* Admin Header */}
              <div className="p-6 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Panel Administratora Korepetycji
                  </h3>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Tutaj możesz zarządzać rezerwacjami uczniów oraz skonfigurować powiadomienia na Discordzie.
                  </p>
                </div>
                
                <button 
                  onClick={() => setIsAdminOpen(false)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors self-end sm:self-center"
                  title="Zamknij Panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Admin Tabs Bar */}
              <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <button
                  onClick={() => setAdminTab('applications')}
                  className={`py-1.5 px-4 text-xs font-bold rounded-lg border transition-all ${
                    adminTab === 'applications' 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Lista Zgłoszeń ({applications.length})
                </button>
                <button
                  onClick={() => setAdminTab('discord')}
                  className={`py-1.5 px-4 text-xs font-bold rounded-lg border transition-all ${
                    adminTab === 'discord' 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Konfiguracja Discord 
                </button>
              </div>

              {/* Tab Content (Scrollable Container) */}
              <div className="flex-1 p-6 overflow-y-auto">
                {adminTab === 'applications' ? (
                  <ApplicationList 
                    applications={applications} 
                    onSelectApplication={(app) => setSelectedApp(app)}
                    selectedApplicationId={selectedApp?.id}
                  />
                ) : (
                  <DiscordIntegrationPanel 
                    config={discordConfig}
                    onSave={handleSaveDiscordConfig}
                    onTest={handleTest}
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Detailed Application popup dialog */}
      <AnimatePresence>
        {selectedApp && (
          <ApplicationDetailModal 
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
            onUpdateStatus={handleUpdateStatus}
            onAddNote={handleAddNote}
            onDeleteApplication={handleDeleteApplication}
            onTriggerDiscordResend={handleManualResendDiscord}
          />
        )}
      </AnimatePresence>

      {/* Cookie acceptance banner overlays at appropriate bottom position */}
      <CookieBanner onPrivacyClick={() => handlePageChange('privacy')} />

    </div>
  );
}
