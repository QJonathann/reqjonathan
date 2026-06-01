/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  Flame, 
  RefreshCw, 
  ToggleLeft, 
  ToggleRight,
  Send
} from 'lucide-react';
import { DiscordConfig } from '../types';

interface DiscordIntegrationPanelProps {
  config: DiscordConfig;
  onSave: (newConfig: DiscordConfig) => void;
  onTestWebhook: (config: DiscordConfig) => Promise<boolean>;
}

export default function DiscordIntegrationPanel({ config, onSave, onTestWebhook }: DiscordIntegrationPanelProps) {
  // Input states
  const [webhookUrl, setWebhookUrl] = useState(config.webhookUrl);
  const [username, setUsername] = useState(config.username || 'Korepetycje Bot 🎓');
  const [avatarUrl, setAvatarUrl] = useState(config.avatarUrl || '');
  const [isEnabled, setIsEnabled] = useState(config.isEnabled);

  // Status indicators
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      webhookUrl: webhookUrl.trim(),
      username: username.trim(),
      avatarUrl: avatarUrl.trim(),
      isEnabled
    });

    setIsSavedSuccessfully(true);
    setTimeout(() => {
      setIsSavedSuccessfully(false);
    }, 3000);
  };

  const handleTestConnection = async () => {
    if (!webhookUrl.trim() || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      setTestResult({
        success: false,
        message: 'Wprowadź prawidłowy adres Discord Webhook przed przetestowaniem.'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const check = await onTestWebhook({
      webhookUrl: webhookUrl.trim(),
      username: username.trim(),
      avatarUrl: avatarUrl.trim(),
      isEnabled: true // temporarily override to prove link
    });

    setIsTesting(false);
    if (check) {
      setTestResult({
        success: true,
        message: 'Sukces! Pakiet testowy został pomyślnie przetworzony i wysłany na Twój kanał Discord.'
      });
    } else {
      setTestResult({
        success: false,
        message: 'Nie udało się nawiązać połączenia. Upewnij się, że adres Webhooka jest w 100% poprawny oraz nie ma blokad.'
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 space-y-6 text-left">
      
      {/* Header with Title and info */}
      <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center shrink-0">
          <Settings className="w-5 h-5 text-blue-600 animate-spin" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Konfiguracja Integracji Discord Webhook
          </h2>
          <p className="text-slate-600 text-xs mt-0.5">
            Podepnij swój własny serwer Discord, a każda nowa rezerwacja od ucznia pojawi się u Ciebie natychmiastowo jako powiadomienie!
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Toggle Switch */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-150">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Integracja Discord Webhook</span>
            <span className="text-[10px] text-slate-600">Zaznacz, czy po wysłaniu formularza wysyłać powiadomienia</span>
          </div>
          <button
            type="button"
            onClick={() => setIsEnabled(!isEnabled)}
            className="text-blue-600 focus:outline-none transition-all"
            title={isEnabled ? "Wyłącz powiadomienia" : "Włącz powiadomienia"}
          >
            {isEnabled ? (
              <ToggleRight className="w-10 h-10 text-blue-600" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-slate-400" />
            )}
          </button>
        </div>

        {/* Webhook URL input field */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center justify-between">
            <span>Adres Webhook URL z Discorda <span className="text-rose-500">*</span></span>
            <span className="text-[10px] text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5 group">
              <HelpCircle className="w-3 h-3 text-blue-600" />
              Jak uzyskać Webhook?
              {/* Tooltip detail hover helper */}
              <span className="hidden group-hover:block absolute bg-slate-900 text-white rounded p-3 text-[10px] max-w-sm right-10 leading-relaxed font-normal z-50">
                1. Wejdź na swój serwer Discord.<br />
                2. Kliknij ikonę koła zębatego obok wybranego kanału tekstowego.<br />
                3. Wejdź w zakładkę <strong>Integracje</strong> -&gt; <strong>Webhooki</strong>.<br />
                4. Kliknij <strong>Utwórz Webhook</strong>, a następnie <strong>Skopiuj adres URL webhooka</strong> i wklej go poniżej!
              </span>
            </span>
          </label>
          <input
            id="discord-url"
            type="password" // password to obfuscate secrets elegantly but let them test
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="np. https://discord.com/api/webhooks/981240124/..."
            className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-blue-600 rounded-xl py-2 px-3 text-xs text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-40 transition-all font-mono"
          />
        </div>

        {/* Advanced bot configuration block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              Nazwa wyświetlana bota
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="np. Korepetycje Bot"
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-blue-600 rounded-xl py-2 px-3 text-xs text-slate-950 focus:outline-none focus:ring-2 focus:ring-opacity-40 transition-all"
            />
          </div>

          {/* Avatar bot URL */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              Link do awatara bota (opcjonalny)
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="np. https://sklep.pl/korepetycje.png"
              className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-blue-600 rounded-xl py-2 px-3 text-xs text-slate-950 focus:outline-none focus:ring-2 focus:ring-opacity-40 transition-all"
            />
          </div>
        </div>

        {/* Action button bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Action to test live */}
          <button
            type="button"
            disabled={isTesting}
            onClick={handleTestConnection}
            className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-2 px-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 focus:outline-none disabled:opacity-60 cursor-pointer"
          >
            {isTesting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-900" />
            ) : (
              <Send className="w-3.5 h-3.5 text-blue-600" />
            )}
            Wyślij integrację testową
          </button>

          {/* Action to save config */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-5 rounded-xl text-xs transition-all tracking-tight shadow-md shadow-blue-600/15 flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
          >
            Zapisz konfigurację
          </button>
        </div>

        {/* Indicators and notifications */}
        {isSavedSuccessfully && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            Zapisano konfigurację Discord Webhook lokalnie!
          </div>
        )}

        {testResult && (
          <div className={`p-3 border rounded-xl text-xs font-semibold flex items-start gap-1.5 ${
            testResult.success 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-150 text-rose-800'
          }`}>
            {testResult.success ? (
              <CheckCircle className="w-4.5 h-4.5 shrink-0" />
            ) : (
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}

      </form>
    </div>
  );
}
