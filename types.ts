export enum ContentType {
  TRIVIA = 'TRIVIA',
  QUOTE = 'QUOTE',
  QA = 'QA',
  OTHER = 'OTHER'
}

export type AspectRatio = 'square' | 'portrait' | 'story';

export interface ExtractedContent {
  type: ContentType;
  question?: string;
  options?: string[];
  correctAnswer?: string; // Optional: index or text of correct answer if detected
  text?: string; // For quotes or simple text
  author?: string; // For quotes
}

export interface ThemeConfig {
  id: string;
  name: string;
  backgroundClass: string;
  cardBgClass: string;
  textColorClass: string;
  accentColorClass: string;
  fontFamily: 'font-sans' | 'font-serif' | 'font-mono';
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  EDITING = 'EDITING',
  ERROR = 'ERROR'
}