/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SubjectType = 'matematyka' | 'fizyka' | 'biologia' | 'informatyka';

export type EducationLevel = 'podstawowa' | 'srednia' | 'studia';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface ApplicationNote {
  id: string;
  author: string;
  content: string;
  dateCreated: string;
}

export interface TutoringApplication {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  parentEmail?: string;
  parentPhone?: string;
  subject: SubjectType;
  level: EducationLevel;
  preferredTimes: string;
  hoursPerWeek: number;
  additionalInfo: string;
  status: ApplicationStatus;
  dateCreated: string;
  notes: ApplicationNote[];
}

export interface DiscordConfig {
  webhookUrl: string;
  isEnabled: boolean;
  username: string;
}

export interface ApplicationFilters {
  searchQuery: string;
  subject: SubjectType | 'all';
  level: EducationLevel | 'all';
  status: ApplicationStatus | 'all';
}
