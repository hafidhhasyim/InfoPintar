export enum GradeLevel {
  Grade7 = 7,
  Grade8 = 8,
  Grade9 = 9,
}

export enum ViewState {
  HOME = 'HOME',
  TOPIC_LIST = 'TOPIC_LIST',
  TOPIC_DETAIL = 'TOPIC_DETAIL',
  AI_TUTOR = 'AI_TUTOR',
  QUIZ = 'QUIZ',
  SETTINGS = 'SETTINGS',
  SEARCH = 'SEARCH',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
}

export interface TopicMaterial {
  id: string;
  title: string; // e.g., "Pengertian", "Perangkat Input", "Perangkat Output"
  content: string; // HTML Content
  quizzes: QuizQuestion[]; // Moved here
  assignments: Assignment[]; // Moved here
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon name mapping
  contentSummary: string;
  materials: TopicMaterial[]; 
}

export interface SubjectModule {
  id: string;
  title: string; // e.g., "Berpikir Komputasional"
  grade: GradeLevel;
  topics: Topic[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ThemeColor = 'ocean' | 'nature' | 'royal' | 'sunset';

export interface ThemeConfig {
  id: ThemeColor;
  name: string;
  primary: string; // bg-blue-600
  primaryHover: string; // hover:bg-blue-700
  secondary: string; // bg-blue-100
  text: string; // text-blue-700
  accent: string; // border-blue-200
  ring: string; // focus:ring-blue-500
  lightText: string; // text-blue-600
}

export interface SearchResult {
  topic: Topic;
  grade: GradeLevel;
  matchType: 'title' | 'description' | 'content';
}

export interface UserProgress {
  materialId: string; // Changed from topicId to materialId
  lastQuizDate: string; // YYYY-MM-DD
  quizScore: number;
}

export interface BannerImage {
  id: string;
  url: string;
  title?: string;
}