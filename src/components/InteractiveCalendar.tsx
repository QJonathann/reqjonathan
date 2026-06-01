/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon, 
  Check, 
  Plus, 
  Trash2, 
  Sparkles,
  CalendarDays
} from 'lucide-react';

interface InteractiveCalendarProps {
  value: string;
  onChange: (newValue: string) => void;
}

type Mode = 'specific' | 'recurring';

const POLISH_MONTHS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

const WEEK_DAYS = ['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sb', 'Nd'];

const TIME_BLOCKS = [
  { id: 'rano', label: 'Rano', range: '8:00 - 12:00' },
  { id: 'poludnie', label: 'Południe', range: '12:00 - 16:00' },
  { id: 'popoludnie', label: 'Popołudnie', range: '16:00 - 19:00' },
  { id: 'wieczor', label: 'Wieczór', range: '19:00 - 22:00' }
];

const WEEKDAY_NAMES_PL = [
  'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'
];

export default function InteractiveCalendar({ value, onChange }: InteractiveCalendarProps) {
  const [activeMode, setActiveMode] = useState<Mode>('recurring');
  
  // Date states for the specific calendar explorer
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Storage of configured choices
  const [chosenTerms, setChosenTerms] = useState<string[]>([]);
  
  // Recurring state checkboxes
  // We keep a record of dayIndex (0-6) -> set of block ids ('rano' | 'poludnie' | etc.)
  const [recurringSlots, setRecurringSlots] = useState<Record<number, string[]>>({});

  // Sync selected options back to the main preferredTimes input string
  useEffect(() => {
    const list: string[] = [];

    // 1. Process recurring selections (e.g. "Poniedziałki popołudniu")
    Object.keys(recurringSlots).forEach((dayKey) => {
      const dayIndex = parseInt(dayKey);
      const blocks = recurringSlots[dayIndex] || [];
      if (blocks.length > 0) {
        const dayName = WEEKDAY_NAMES_PL[dayIndex];
        const blockLabels = blocks.map(bId => {
          const block = TIME_BLOCKS.find(tb => tb.id === bId);
          return block ? `${block.label} (${block.range})` : '';
        }).filter(Boolean);
        list.push(`${dayName} (${blockLabels.join(', ')})`);
      }
    });

    // 2. Process specific date selections (e.g. "Czwartek, 04.06.2026 (16:00-19:00)")
    chosenTerms.forEach(term => {
      if (!list.includes(term)) {
        list.push(term);
      }
    });

    if (list.length > 0) {
      onChange(list.join('; '));
    }
  }, [recurringSlots, chosenTerms]);

  // Calendar generation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate date cells
  const getDaysInMonth = () => {
    const firstDay = new Date(year, month, 1);
    // getDay returns 0 for Sunday. Convert Monday to 0, Sunday to 6:
    const firstDayIndex = (firstDay.getDay() + 6) % 7;
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const cells: { dayNum: number | null; dateObj: Date | null }[] = [];
    
    // Empty cells for padding
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ dayNum: null, dateObj: null });
    }
    
    // Real day cells
    for (let day = 1; day <= totalDays; day++) {
      cells.push({
        dayNum: day,
        dateObj: new Date(year, month, day)
      });
    }
    
    return cells;
  };

  // Check if a cell date is "today"
  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Check if a cell is selected date
  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  // Switch recurring weekday block state
  const toggleRecurring = (dayIndex: number, blockId: string) => {
    setRecurringSlots(prev => {
      const currentBlocks = prev[dayIndex] || [];
      let newBlocks: string[];
      if (currentBlocks.includes(blockId)) {
        newBlocks = currentBlocks.filter(b => b !== blockId);
      } else {
        newBlocks = [...currentBlocks, blockId];
      }
      return {
        ...prev,
        [dayIndex]: newBlocks
      };
    });
  };

  // Quick select preset templates
  const applyPreset = (presetType: 'weekdays-afternoon' | 'weekends' | 'clear') => {
    if (presetType === 'clear') {
      setRecurringSlots({});
      setChosenTerms([]);
      onChange('');
      return;
    }

    if (presetType === 'weekdays-afternoon') {
      const updated: Record<number, string[]> = {};
      // Mon (0) to Fri (4) -> afternoon slot
      for (let i = 0; i < 5; i++) {
        updated[i] = ['popoludnie'];
      }
      setRecurringSlots(updated);
    } else if (presetType === 'weekends') {
      const updated: Record<number, string[]> = {};
      // Sat (5) and Sun (6) -> rano, poludnie
      updated[5] = ['rano', 'poludnie'];
      updated[6] = ['rano', 'poludnie'];
      setRecurringSlots(updated);
    }
  };

  // Add a specific date slot choice
  const addSpecificSlot = (blockLabel: string) => {
    if (!selectedDate) return;
    
    const formattedDate = selectedDate.toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    
    const newTerm = `${formattedDate} (${blockLabel})`;
    
    if (!chosenTerms.includes(newTerm)) {
      setChosenTerms(prev => [...prev, newTerm]);
    }
  };

  // Delete an added specific term from the list
  const deleteSpecificTerm = (indexToRemove: number) => {
    setChosenTerms(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4 md:p-5 shadow-inner space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <span className="text-xs font-extrabold text-slate-800 tracking-wide uppercase flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4 text-blue-600" />
          Inteligentny Asystent Terminów
        </span>
        
        {/* Toggle between specific and recurring tabs */}
        <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs self-start">
          <button
            type="button"
            onClick={() => setActiveMode('recurring')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              activeMode === 'recurring' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Seryjne dni (np. Każdy wtorek)
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('specific')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              activeMode === 'specific' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Konkretne daty z kalendarza
          </button>
        </div>
      </div>

      {activeMode === 'recurring' ? (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 flex flex-col md:flex-row md:items-center justify-between gap-2 bg-slate-100 p-2.5 rounded-lg border border-slate-200/50">
            <span>Klikaj na pory dnia pod odpowiednimi dniami tygodnia, kiedy masz wolny czas.</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => applyPreset('weekdays-afternoon')}
                className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded text-[10px] font-semibold text-slate-700 transition"
              >
                Popołudnia w tygodniu ⚡
              </button>
              <button
                type="button"
                onClick={() => applyPreset('weekends')}
                className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded text-[10px] font-semibold text-slate-700 transition"
              >
                Weekendy 🌅
              </button>
              <button
                type="button"
                onClick={() => applyPreset('clear')}
                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded text-[10px] font-semibold text-rose-700 transition"
              >
                Wyczyść wszystko 🗑️
              </button>
            </div>
          </div>

          {/* Grid weekly schedule */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {WEEKDAY_NAMES_PL.map((dayName, dayIdx) => {
              const activeForThisDay = recurringSlots[dayIdx] || [];
              const isWeekendDay = dayIdx >= 5;

              return (
                <div 
                  key={dayName} 
                  className={`bg-white rounded-xl border ${
                    isWeekendDay ? 'border-slate-300 bg-slate-50/20' : 'border-slate-200'
                  } p-2.5 transition flex flex-col space-y-1.5`}
                >
                  <div className="text-center font-bold text-xs text-slate-800 border-b border-slate-100 pb-1.5">
                    {dayName}
                    {isWeekendDay && <span className="text-[9px] text-amber-600 block font-normal">Weekend</span>}
                  </div>
                  
                  {/* Blocks under day */}
                  <div className="flex flex-col gap-1">
                    {TIME_BLOCKS.map(block => {
                      const isSelectedBlock = activeForThisDay.includes(block.id);
                      return (
                        <button
                          type="button"
                          key={block.id}
                          onClick={() => toggleRecurring(dayIdx, block.id)}
                          className={`w-full text-left p-1.5 rounded-lg border text-[10px] transition-all cursor-pointer flex flex-col justify-between ${
                            isSelectedBlock 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="font-bold">{block.label}</span>
                          <span className={`text-[8px] ${isSelectedBlock ? 'text-blue-100' : 'text-slate-400'}`}>
                            {block.range}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left panel: Calendar date switcher */}
          <div className="md:col-span-7 bg-white p-4 rounded-xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                {POLISH_MONTHS[month]} {year}
              </h4>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Days template labels */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-slate-400 mb-1">
              {WEEK_DAYS.map(wd => <div key={wd}>{wd}</div>)}
            </div>

            {/* Monthly Grid */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth().map((cell, idx) => {
                const isSelectedDay = isSelected(cell.dateObj);
                const isCurrentToday = isToday(cell.dateObj);
                
                if (!cell.dayNum || !cell.dateObj) {
                  return <div key={`empty-${idx}`} className="aspect-square" />;
                }

                return (
                  <button
                    type="button"
                    key={`day-${cell.dayNum}`}
                    onClick={() => setSelectedDate(cell.dateObj)}
                    className={`aspect-square text-xs font-semibold rounded-lg flex flex-col items-center justify-center relative cursor-pointer group transition-all ${
                      isSelectedDay 
                        ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-600 ring-offset-2' 
                        : isCurrentToday 
                          ? 'bg-blue-50 border border-blue-300 text-blue-700 font-bold' 
                          : 'bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700'
                    }`}
                  >
                    {cell.dayNum}
                    {isCurrentToday && !isSelectedDay && (
                      <span className="absolute bottom-1 w-1 h-1 bg-blue-700 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: hours for selected date & chosen terms view */}
          <div className="md:col-span-5 flex flex-col space-y-4">
            {/* Add time slots to selected date */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Pory dnia dla wybranej daty
              </span>
              
              {selectedDate ? (
                <div className="space-y-3">
                  <div className="bg-blue-50/50 p-2 rounded-xl text-xs border border-blue-100 text-blue-800 font-bold">
                    📅 {selectedDate.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_BLOCKS.map(tb => (
                      <button
                        type="button"
                        key={tb.id}
                        onClick={() => addSpecificSlot(`${tb.label} (${tb.range})`)}
                        className="flex flex-col items-center justify-center p-2 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 rounded-xl text-center group cursor-pointer transition-all"
                      >
                        <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700">{tb.label}</span>
                        <span className="text-[9px] text-slate-500">{tb.range}</span>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[9px] font-extrabold text-blue-600 bg-blue-50 py-0.5 px-1.5 rounded-md border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <Plus className="w-2.5 h-2.5" /> Dodaj
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 text-xs text-slate-400 leading-relaxed italic">
                  Wybierz datę z kalendarza po lewej stronie, aby określić dla niej dogodne godziny.
                </div>
              )}
            </div>

            {/* List of custom chosen specific terms list */}
            {chosenTerms.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Wybrane terminy ({chosenTerms.length})
                </span>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {chosenTerms.map((term, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between gap-2 p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px]"
                    >
                      <span className="font-medium truncate">{term}</span>
                      <button
                        type="button"
                        onClick={() => deleteSpecificTerm(idx)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1 rounded-md transition cursor-pointer"
                        title="Usuń ten termin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Synchronized results text footer */}
      {value && (
        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5">
            <span className="block text-[10px] font-bold text-blue-700 uppercase tracking-wider">
              Podgląd wygenerowanego harmonogramu:
            </span>
            <p className="text-slate-700 font-medium italic break-normal pr-4 select-all">
              "{value}"
            </p>
          </div>
          <button
            type="button"
            onClick={() => applyPreset('clear')}
            className="self-start sm:self-center text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100/80 px-2 py-1 rounded-lg border border-rose-200 transition cursor-pointer"
          >
            Resetuj terminy
          </button>
        </div>
      )}
    </div>
  );
}
