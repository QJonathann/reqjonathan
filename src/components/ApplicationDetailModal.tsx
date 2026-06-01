/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Clock, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  FileText, 
  MessageSquare, 
  PlusCircle, 
  Trash2, 
  Send,
  Bookmark
} from 'lucide-react';
import { TutoringApplication, ApplicationStatus } from '../types';
import { SUBJECT_LABELS, LEVEL_LABELS, STATUS_LABELS } from '../data';

interface ApplicationDetailModalProps {
  application: TutoringApplication;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onAddNote: (id: string, content: string) => void;
  onDeleteApplication: (id: string) => void;
  onTriggerDiscordResend: (application: TutoringApplication) => void;
}

export default function ApplicationDetailModal({
  application,
  onClose,
  onUpdateStatus,
  onAddNote,
  onDeleteApplication,
  onTriggerDiscordResend
}: ApplicationDetailModalProps) {
  const [newNote, setNewNote] = useState('');
  const [noteError, setNoteError] = useState('');

  const subInfo = SUBJECT_LABELS[application.subject];
  const statInfo = STATUS_LABELS[application.status];

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) {
      setNoteError('Treść notatki nie może być pusta.');
      return;
    }
    onAddNote(application.id, newNote.trim());
    setNewNote('');
    setNoteError('');
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div id="application-detail-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl w-full text-left overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 rounded px-2 py-0.5">
                {application.id}
              </span>
              <span className="text-slate-600 text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Nadesłano: {formatDate(application.dateCreated)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-2 tracking-tight">
              Szczegóły rezerwacji: {application.studentName}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-1 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            title="Zamknij"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Container Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Main info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            {/* Contact details */}
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Podstawowe dane ucznia</p>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-900">{application.studentName}</span>
                </div>
              </div>

              {application.parentEmail || application.parentPhone ? (
                <div className="space-y-3">
                  <div className="border-t border-slate-200/60 pt-2 space-y-1">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">👪 Dane Rodzica (Zgłaszający)</p>
                    {application.parentEmail && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span>{application.parentEmail}</span>
                      </div>
                    )}
                    {application.parentPhone && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <span>{application.parentPhone}</span>
                      </div>
                    )}
                  </div>

                  {(application.studentEmail || application.studentPhone) && (
                    <div className="border-t border-slate-200/60 pt-2 space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">🎓 Bezpośredni kontakt ucznia</p>
                      {application.studentEmail && (
                        <div className="flex items-center gap-2 text-slate-700">
                          <Mail className="w-4 h-4 text-slate-500" />
                          <span>{application.studentEmail}</span>
                        </div>
                      )}
                      {application.studentPhone && (
                        <div className="flex items-center gap-2 text-slate-700">
                          <Phone className="w-4 h-4 text-slate-500" />
                          <span>{application.studentPhone}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kontakt bezpośredni</p>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>{application.studentEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>{application.studentPhone}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Teaching requirements */}
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Przedmiot i poziom</p>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${subInfo.bg} ${subInfo.text}`}>
                  {subInfo.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Poziom: <strong>{LEVEL_LABELS[application.level]}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Ilość godzin: <strong>{application.hoursPerWeek || 1} godz. / tydzień</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Terminy: <strong className="text-slate-900">{application.preferredTimes}</strong></span>
              </div>
            </div>
          </div>

          {/* Change Application Status & Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/20">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status rekrutacji</p>
              <div className="flex items-center gap-2.5">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statInfo.bg} ${statInfo.text}`}>
                  {statInfo.label}
                </span>
                <select
                  value={application.status}
                  onChange={(e) => onUpdateStatus(application.id, e.target.value as ApplicationStatus)}
                  className="bg-white border border-slate-300 text-xs px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 font-bold"
                >
                  <option value="pending">Oczekujące</option>
                  <option value="accepted">Zaakceptowane</option>
                  <option value="rejected">Odrzucone</option>
                </select>
              </div>
            </div>

            {/* Live Discord Action */}
            <button
              onClick={() => onTriggerDiscordResend(application)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Wyślij / Testuj na Discordzie
            </button>
          </div>

          {/* Detailed requirements / description description */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-blue-600" />
              Cele nauk oraz trudności ucznia
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-900 text-xs leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
              {application.additionalInfo}
            </div>
          </div>

          {/* Internal annotations list */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4.5 h-4.5 text-blue-600" />
              Notatki wewnętrzne organizatora ({application.notes.length})
            </h4>

            {application.notes.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Brak dotychczasowych notatek organizatora.</p>
            ) : (
              <div className="space-y-2.5">
                {application.notes.map((note) => (
                  <div key={note.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                    <div className="flex items-center justify-between pointer-events-none mb-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <Bookmark className="w-3 h-3 text-blue-600" />
                        {note.author}
                      </span>
                      <span className="text-[10px] text-slate-500">{formatDate(note.dateCreated)}</span>
                    </div>
                    <p className="text-slate-950">{note.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Note submit action */}
            <form onSubmit={handleNoteSubmit} className="space-y-2 pt-1">
              <textarea
                value={newNote}
                onChange={(e) => {
                  setNewNote(e.target.value);
                  if (e.target.value.trim()) setNoteError('');
                }}
                rows={2}
                placeholder="Dodaj wewnętrzny komentarz, np. termin rozmowy próbnej, ustalona cena za godzinę..."
                className={`w-full bg-white border ${
                  noteError ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600'
                } rounded-xl py-2 px-3 text-xs text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-40`}
              />
              {noteError && <p className="text-rose-500 text-[10px]">{noteError}</p>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all flex items-center gap-1 focus:outline-none"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Dodaj notatkę
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => {
              if (confirm('Czy na pewno chcesz usunąć tę rezerwację z bazy?')) {
                onDeleteApplication(application.id);
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:underline px-3 py-2 font-bold cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Usuń rezerwację
          </button>

          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-4 rounded-xl text-xs transition-all"
          >
            Zamknij panel
          </button>
        </div>

      </motion.div>
    </div>
  );
}
