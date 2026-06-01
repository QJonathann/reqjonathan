/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  User, 
  Inbox, 
  X,
  TrendingUp,
  Mail,
  Phone,
  GraduationCap
} from 'lucide-react';
import { TutoringApplication, ApplicationFilters, SubjectType, EducationLevel, ApplicationStatus } from '../types';
import { SUBJECT_LABELS, LEVEL_LABELS, STATUS_LABELS } from '../data';

interface ApplicationListProps {
  applications: TutoringApplication[];
  onSelectApplication: (app: TutoringApplication) => void;
  selectedApplicationId?: string;
}

export default function ApplicationList({ applications, onSelectApplication, selectedApplicationId }: ApplicationListProps) {
  const [filters, setFilters] = useState<ApplicationFilters>({
    searchQuery: '',
    subject: 'all',
    level: 'all',
    status: 'all'
  });

  // Totals calculations
  const total = applications.length;
  const pending = applications.filter(a => a.status === 'pending').length;
  const accepted = applications.filter(a => a.status === 'accepted').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;

  // Filter logic
  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.studentName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      app.studentEmail.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      app.studentPhone.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      app.additionalInfo.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesSubject = filters.subject === 'all' || app.subject === filters.subject;
    const matchesLevel = filters.level === 'all' || app.level === filters.level;
    const matchesStatus = filters.status === 'all' || app.status === filters.status;

    return matchesSearch && matchesSubject && matchesLevel && matchesStatus;
  });

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

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      subject: 'all',
      level: 'all',
      status: 'all'
    });
  };

  return (
    <div id="application-list-container" className="space-y-6">
      
      {/* 1. Statistics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Wszystkie rezerwacje</p>
            <h4 className="text-xl font-extrabold text-slate-900 mt-0.5">{total}</h4>
          </div>
          <div className="w-8.5 h-8.5 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500">
            <Inbox className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-semibold">Oczekujące</p>
            <h4 id="stat-pending-applications" className="text-xl font-extrabold text-amber-600 mt-0.5">{pending}</h4>
          </div>
          <div className="w-8.5 h-8.5 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
            <Clock className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Accepted */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Zaakceptowane</p>
            <h4 className="text-xl font-extrabold text-emerald-600 mt-0.5">{accepted}</h4>
          </div>
          <div className="w-8.5 h-8.5 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500">
            <CheckCircle className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Odrzucone</p>
            <h4 className="text-xl font-extrabold text-rose-600 mt-0.5">{rejected}</h4>
          </div>
          <div className="w-8.5 h-8.5 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
            <X className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      {/* 2. Filters card */}
      <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Filter className="w-4.5 h-4.5 text-blue-600" />
            Wyszukiwanie i filtry admina
          </h3>
          {(filters.searchQuery || filters.subject !== 'all' || filters.level !== 'all' || filters.status !== 'all') && (
            <button
              onClick={resetFilters}
              className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              Wyczyść filtry
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Query search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Szukaj imienia, tel, opisu..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={filters.subject}
              onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value as SubjectType | 'all' }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            >
              <option value="all">Wszystkie przedmioty</option>
              <option value="matematyka">Matematyka</option>
              <option value="fizyka">Fizyka</option>
              <option value="biologia">Biologia</option>
              <option value="informatyka">Informatyka</option>
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value as EducationLevel | 'all' }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            >
              <option value="all">Każdy poziom edukacji</option>
              <option value="podstawowa">Szkoła Podstawowa</option>
              <option value="srednia">Liceum / Technikum</option>
              <option value="studia">Studia Wyższe</option>
            </select>
          </div>
        </div>

        {/* Extra status horizontal selection */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-2">Status:</span>
          {([
            { id: 'all', label: 'Wszystkie' },
            { id: 'pending', label: 'Oczekujące' },
            { id: 'accepted', label: 'Zaakceptowane' },
            { id: 'rejected', label: 'Odrzucone' }
          ] as const).map((st) => (
            <button
              key={st.id}
              onClick={() => setFilters(prev => ({ ...prev, status: st.id }))}
              className={`py-1 px-3.5 text-xs rounded-full border transition-all ${
                filters.status === st.id 
                  ? 'bg-blue-600 text-white border-blue-600 font-bold' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Applications list wrapper */}
      <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-900">
            Zgłoszenia uczniów <span className="text-[10px] uppercase font-bold text-blue-600 px-1.5 py-0.5 bg-blue-50 border border-blue-200 rounded-md ml-1.5">{filteredApps.length} z {total}</span>
          </p>
        </div>

        {filteredApps.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-900">Brak dopasowanych rezerwacji</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">Zmień parametry filtrów powyżej lub utwórz nową testową rezerwację w formularzu.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-[550px] overflow-y-auto">
            <AnimatePresence initial={false}>
              {filteredApps.map((app) => {
                const isSelected = selectedApplicationId === app.id;
                const subInfo = SUBJECT_LABELS[app.subject];
                const statInfo = STATUS_LABELS[app.status];

                return (
                  <motion.div
                    key={app.id}
                    id={`app-card-${app.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => onSelectApplication(app)}
                    className={`p-5 transition-all cursor-pointer text-left relative flex flex-col gap-3 group border-l-4 ${
                      isSelected 
                        ? 'bg-blue-50/40 border-l-blue-600' 
                        : 'hover:bg-slate-50 border-l-transparent'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 rounded px-1.5 py-0.2">
                            {app.id}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {formatDate(app.dateCreated)}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1.5 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                          {app.studentName}
                        </h4>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statInfo.bg} ${statInfo.text}`}>
                        {statInfo.label}
                      </span>
                    </div>

                    {/* Brief detail info */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed whitespace-pre-wrap">
                      {app.additionalInfo}
                    </p>

                    {/* Bottom stats row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-50 text-[11px]">
                      {/* Left: contact details */}
                      <div className="flex items-center gap-3 text-slate-600">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          {app.studentEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-blue-600" />
                          {app.studentPhone}
                        </span>
                      </div>

                      {/* Right: subject and education badges */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {app.hoursPerWeek || 1}h/tydz.
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${subInfo.bg} ${subInfo.text}`}>
                          {subInfo.label}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          {LEVEL_LABELS[app.level]}
                        </span>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
}
