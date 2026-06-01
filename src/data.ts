/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TutoringApplication, SubjectType, EducationLevel, ApplicationStatus } from './types';

export const INITIAL_APPLICATIONS: TutoringApplication[] = [
  {
    id: 'KOR-2041',
    studentName: 'Kamil Wiśniewski',
    studentEmail: 'kamil.wisniewski@gmail.com',
    studentPhone: '501 234 567',
    subject: 'matematyka',
    level: 'srednia',
    preferredTimes: 'Dni powszednie po godzinie 16:00, najlepiej wtorki i czwartki',
    hoursPerWeek: 2,
    additionalInfo: 'Przygotowanie do matury rozszerzonej z matematyki. Największy problem mam z geometrią analityczną i prawdopodobieństwem. Zależy mi na regularnych spotkaniach raz w tygodniu.',
    status: 'pending',
    dateCreated: '2026-06-01T10:15:00Z',
    notes: [
      {
        id: 'n-1',
        author: 'System',
        content: 'Zgłoszenie zarejestrowane pomyślnie.',
        dateCreated: '2026-06-01T10:15:00Z'
      }
    ]
  },
  {
    id: 'KOR-1893',
    studentName: 'Alicja Kowalska',
    studentEmail: 'alicja.kowalska@onet.pl',
    studentPhone: '602 987 654',
    subject: 'fizyka',
    level: 'srednia',
    preferredTimes: 'Soboty rano (9:00 - 12:00) lub piątki po 15:00',
    hoursPerWeek: 1,
    additionalInfo: 'Potrzebuję pomocy w bieżącym materiale w 2 klasie liceum. Chcę poprawić oceny z fizyki, zwłaszcza z tematów związanych z termodynamiką i optyką.',
    status: 'accepted',
    dateCreated: '2026-05-31T14:20:00Z',
    notes: [
      {
        id: 'n-2',
        author: 'System',
        content: 'Zatwierdzono i wysłano powiadomienie e-mail.',
        dateCreated: '2026-05-31T15:10:00Z'
      }
    ]
  },
  {
    id: 'KOR-0452',
    studentName: 'Mateusz Nowak',
    studentEmail: 'mat.nowak@szkola.pl',
    studentPhone: '730 111 222',
    subject: 'biologia',
    level: 'podstawowa',
    preferredTimes: 'Każdy dzień po 14:00 oprócz środy',
    hoursPerWeek: 2,
    additionalInfo: 'Syn jest w 8 klasie szkoły podstawowej. Zależy nam na solidnym przygotowaniu do egzaminu ósmoklasisty, ze szczególnym uwzględnieniem gramatyki i pisania wypracowań.',
    status: 'accepted',
    dateCreated: '2026-05-30T09:00:00Z',
    notes: [
      {
        id: 'n-3',
        author: 'Tutor Admin',
        content: 'Konsultacja telefoniczna odbyta. Rodzic zdecydowany na pakiet 8 godzin w miesiącu.',
        dateCreated: '2026-05-30T11:45:00Z'
      }
    ]
  },
  {
    id: 'KOR-1102',
    studentName: 'Patrycja Dudek',
    studentEmail: 'patrycja.dudek@student.pw.edu.pl',
    studentPhone: '509 888 777',
    subject: 'informatyka',
    level: 'studia',
    preferredTimes: 'Godziny wieczorne, najlepiej online po 19:00',
    hoursPerWeek: 1,
    additionalInfo: 'Studiuję na politechnice i mam problem z zaliczeniem przedmiotu "Algorytmy i struktury danych" w języku C++. Szukam kogoś, kto wytłumaczy mi drzewa binarne i algorytmy grafowe w przystępny sposób.',
    status: 'pending',
    dateCreated: '2026-06-01T12:00:00Z',
    notes: []
  }
];

export const SUBJECT_LABELS: Record<SubjectType, { label: string; bg: string; text: string }> = {
  matematyka: { label: 'Matematyka', bg: 'bg-blue-50', text: 'text-blue-700' },
  fizyka: { label: 'Fizyka', bg: 'bg-purple-50', text: 'text-purple-700' },
  informatyka: { label: 'Informatyka', bg: 'bg-rose-50', text: 'text-rose-700' },
  biologia: { label: 'Biologia', bg: 'bg-lime-50', text: 'text-lime-800' },
};

export const LEVEL_LABELS: Record<EducationLevel, string> = {
  podstawowa: 'Szkoła Podstawowa',
  srednia: 'Liceum / Technikum',
  studia: 'Studia Wyższe',
};

export const STATUS_LABELS: Record<ApplicationStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'Oczekujące', bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-700' },
  accepted: { label: 'Zaakceptowane', bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700' },
  rejected: { label: 'Odrzucone', bg: 'bg-rose-50 border border-rose-200', text: 'text-rose-700' },
};
